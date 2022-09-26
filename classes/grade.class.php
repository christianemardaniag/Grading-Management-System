<?php
class Grade extends dbHandler
{

    public function __construct()
    {
        parent::__construct();
        $arguments = func_get_args();
        switch ($arguments) {
            case 0:
                # code...
                break;
            case 1:
                call_user_func_array(array($this, "withID"), $arguments);
                break;
        }
    }

    // PUBLIC FUNCTIONS
    public function getGrades()
    {
    }

    // PRIVATE FUNCTIONS

    private function withID($id)
    {
    }
}
