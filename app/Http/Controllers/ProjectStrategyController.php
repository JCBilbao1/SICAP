<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ProjectStrategy;

class ProjectStrategyController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $project_strategy = ProjectStrategy::all();
        return response()->json($project_strategy);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $project_strategy = new ProjectStrategy;
        $project_strategy->name = $request['name'];
        $project_strategy->save();
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
        $project_strategy = ProjectStrategy::find($id);
        return response()->json($project_strategy);
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
        $project_strategy = ProjectStrategy::find($id);
        $project_strategy->name = $request['name'];
        $project_strategy->save();
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
        $project_strategy = ProjectStrategy::findorfail($id);
        $project_strategy->delete();
        return response()->json(['message'=>'Successfuly Deleted!']);
    }
}
