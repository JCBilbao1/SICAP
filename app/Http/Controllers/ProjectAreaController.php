<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ProjectArea;

class ProjectAreaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $project_area = ProjectArea::all();
        return response()->json($project_area);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $project_area = new ProjectArea;
        $project_area->name = $request['name'];
        $project_area->save();
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
        $project_area = ProjectArea::find($id);
        return response()->json($project_area);
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
        $project_area = ProjectArea::find($id);
        $project_area->name = $request['name'];
        $project_area->save();
        return response()->json(['status'=>"Success update!"]);
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
        $project_area = ProjectArea::findorfail($id);
        $project_area->delete();
        return response()->json(['message'=>'Successfuly Deleted!']);
    }
}
