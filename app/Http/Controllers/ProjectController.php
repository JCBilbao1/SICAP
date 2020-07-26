<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Project;
use App\Models\Stakeholder;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $project = Project::with('stakeholders')->get();
        return response()->json($project);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $rules = [
            'project_area' => 'required',
            'project_strategy' => 'required',
            'project_place' => 'required',
            'project_theme' => 'required',
            'project_date' => 'required|date_format:Y-m-d',
            'project_time' => 'required|date_format:H:i',
        ];
    
        $customMessages = [
            'project_date.date_format' => 'The date must be in YYYY-MM-DD format.',
            'project_time.date_format' => 'The time must be in 24 hour & HH:MM format.'
        ];
    
        $this->validate($request, $rules, $customMessages);
        $date = date_format(date_create($request['project_date'].' '.$request['project_time']), "Y/m/d H:i:s");

        $project = new Project;
        $project->project_area = $request['project_area'];
        $project->project_strategy = $request['project_strategy'];
        $project->place = $request['project_place'];
        $project->theme = $request['project_theme'];
        $project->date = $date;
        $project->save();

        return response()->json(['status'=>'Project created!', 'project_id'=>$project->id]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $project = Project::find($id);
        $project->stakeholders = $project->stakeholders()->with('field_data')->get();
        return response()->json($project);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $rules = [
            'project_area' => 'required',
            'project_strategy' => 'required',
            'project_place' => 'required',
            'project_theme' => 'required',
            'project_date' => 'required|date_format:Y-m-d',
            'project_time' => 'required|date_format:H:i',
        ];
    
        $customMessages = [
            'project_date.date_format' => 'The date must be in YYYY-MM-DD format.',
            'project_time.date_format' => 'The time must be in 24 hour & HH:MM format.'
        ];
    
        $this->validate($request, $rules, $customMessages);
        $date = date_format(date_create($request['project_date'].' '.$request['project_time']), "Y/m/d H:i:s");
        
        $project = Project::find($id);
        $project->project_area = $request['project_area'];
        $project->project_strategy = $request['project_strategy'];
        $project->place = $request['project_place'];
        $project->theme = $request['project_theme'];
        $project->date = $date;
        $project->save();

        $stakeholders = $request['stakeholders'];
        if( $stakeholders && count($stakeholders) > 0){
            foreach($stakeholders as $index => $stakeholder) {
                if(isset($stakeholder['id']) && !empty($project->stakeholders()->find($stakeholder['id']))) {
                    $old_stakeholder = $project->stakeholders()->find($stakeholder['id']);
                    if($stakeholder['stakeholder'] == $old_stakeholder->stakeholder) {
                        if($stakeholder['stakeholder_type'] == $old_stakeholder->stakeholder_type) {
                            foreach($stakeholder['stakeholder_field_data'] as $field_data) {
                                $stakeholder_field_data = [
                                    'stakeholder_field_value' => $field_data['stakeholder_field_value']
                                ];
                                $old_stakeholder->field_data()->find($field_data['id'])->update($stakeholder_field_data);
                            }
                        }
                    } else {
                        $old_stakeholder->field_data()->delete();
                        $old_stakeholder->update([
                            'stakeholder' => $stakeholder['stakeholder'],
                            'stakeholder_type' => $stakeholder['stakeholder_type'],
                        ]);
                        foreach($stakeholder['stakeholder_field_data'] as $field_data) {
                            $old_stakeholder->field_data()->insert([
                                'project_stakeholder_id' => $old_stakeholder->id,
                                'stakeholder_field' => $field_data['stakeholder_field'],
                                'stakeholder_field_value' => $field_data['stakeholder_field_value']
                            ]);
                        }
                    }
                } else {
                    $new_stakeholder = new Stakeholder;
                    $new_stakeholder->project_id = $project->id;
                    $new_stakeholder->stakeholder = $stakeholder['stakeholder'];
                    $new_stakeholder->stakeholder_type = $stakeholder['stakeholder_type'];
                    $new_stakeholder->save();
                    foreach($stakeholder['stakeholder_field_data'] as $field_data) {
                        $stakeholder_field_data = [
                            'project_stakeholder_id' => $new_stakeholder->id,
                            'stakeholder_field' => $field_data['stakeholder_field'],
                            'stakeholder_field_value' => $field_data['stakeholder_field_value']
                        ];
                        $new_stakeholder->field_data()->insert($stakeholder_field_data);
                    }
                    $stakeholders[$index]['id'] = $new_stakeholder->id;
                }
            }
            $project_stakeholder_ids = collect($stakeholders)->pluck('id')->toArray();
            $stakeholders_to_delete = $project->stakeholders()->whereNotIn('id', $project_stakeholder_ids)->delete();
        } else {
            $project->stakeholders()->delete();
        }
        
        $project->stakeholders = $project->stakeholders()->with('field_data')->get();

        return response()->json(['status'=>'Project Updated!', 'data'=>$project]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    public function deleteTemporary($id){
        $project = Project::findorfail($id);
        $project->delete();
        return response()->json(['message'=>'Successfuly Deleted!']);
    }
}
