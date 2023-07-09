import React, { Component } from 'react'
import GoalItem from './GoalItem'
import TaskInput from './TaskInput'

export default class inputDisplay extends Component {
    render() {
        return (
            <>
                <GoalItem />
                <TaskInput />
            </>
        )
    }
}