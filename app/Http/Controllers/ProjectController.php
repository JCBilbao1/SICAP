<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Project;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $project = Project::all();
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
        $validatedData = $request->validate([
            'project_area' => 'required',
            'project_strategy' => 'required',
            'project_place' => 'required',
            'project_theme' => 'required',
            'project_date' => 'required|date_format:Y-m-d',
            'project_time' => 'required|date_format:H:i',
            'stakeholders' => 'required|array|min:1'
        ]);
        $date = date_format(date_create($request['project_date'].' '.$request['project_time']), "Y/m/d H:i:s");

        $project = new Project;
        $project->project_area = $request['project_area'];
        $project->project_strategy = $request['project_strategy'];
        $project->place = $request['project_place'];
        $project->theme = $request['project_theme'];
        $project->date = $date;
        $project->save();

        $stakeholders = $request['stakeholders'];
        foreach($stakeholders as $stakeholder) {
            foreach($stakeholder['stakeholder_field_data'] as $field_data) {
                $stakeholder_data = new Stakeholder([
                    'stakeholder' => $stakeholder['stakeholder'],
                    'stakeholder_type' => $stakeholder['stakeholder_type'],
                    'stakeholder_field' => $field_data['key'],
                    'stakeholder_field_value' => $field_data['value']
                ]);
                $project->stakeholders()->save($stakeholder_data);
            }
        }

        return response()->json(['status'=>"Success Creation!"]);
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
        $project->stakeholders = $project->stakeholders;
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
        $validatedData = $request->validate([
            'project_area' => 'required',
            'project_strategy' => 'required',
            'project_place' => 'required',
            'project_theme' => 'required',
            'project_date' => 'required|date_format:Y-m-d',
            'project_time' => 'required|date_format:H:i',
            'stakeholders' => 'required|array|min:1'
        ]);
        $date = date_format(date_create($request['project_date'].' '.$request['project_time']), "Y/m/d H:i:s");
        
        $project = Project::find($id);
        $project->project_area = $request['project_area'];
        $project->project_strategy = $request['project_strategy'];
        $project->place = $request['project_place'];
        $project->theme = $request['project_theme'];
        $project->date = $date;
        $project->save();

        $stakeholders = $request['stakeholders'];
        foreach($stakeholders as $stakeholder) {
            foreach($stakeholder['stakeholder_field_data'] as $field_data) {
                $stakeholder_data = new Stakeholder([
                    'stakeholder' => $stakeholder['stakeholder'],
                    'stakeholder_type' => $stakeholder['stakeholder_type'],
                    'stakeholder_field' => $field_data['key'],
                    'stakeholder_field_value' => $field_data['value']
                ]);
                $project->stakeholders()->save($stakeholder_data);
            }
        }

        return response()->json(['status'=>"Update Success!"]);
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
