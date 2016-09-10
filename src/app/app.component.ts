import {Component, OnInit} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent implements OnInit {
  discount_factor: number = 0.5;
  transitions = [[1, 3, 4, 12], //0
    [0, 2, 5, 13], //1
    [3, 1, 6, 14], //2
    [2, 0, 7, 15], //3
    [5, 7, 0, 8], //4
    [4, 6, 1, 9], //5
    [7, 5, 2, 10], //6
    [6, 4, 3, 11], //7
    [9, 11, 12, 4], //8
    [8, 10, 13, 5], //9
    [11, 9, 14, 6], //10
    [10, 8, 15, 7], //11
    [13, 15, 8, 0], //12
    [12, 14, 9, 1], //13
    [15, 13, 10, 2], //14
    [14, 12, 11, 3]]; //15
  rewards = [[0, -10, 0, -10], //0
    [0, 0, -10, -10], //1
    [0, 0, -10, -10], //2
    [0, -10, 0, -10], //3
    [-10, -10, 0, 0], //4
    [-5, -10, -5, -10], //5
    [-5, -10, -5, -10], //6
    [-10, 10, 0, 0], //7
    [-10, -10, 0, 0], //8
    [-5, -10, -5, -10], //9
    [-5, -10, -5, -10], //10
    [-10, 10, 0, 0], //11
    [0, -10, 0, -10], //12
    [0, 0, -10, 10], //13
    [0, 0, -10, 10], //14
    [0, -10, 0, -10]]; //15

  policy = this.calculate_policy(this.transitions, this.rewards, this.discount_factor);
  initial_state;
  num_steps = 20;
  steps = [];

  ngOnInit(){
    //this.simulate();
  }

  simulate(random: boolean){
    if (random) {
      this.initial_state = Math.floor(Math.random() * (15 - 0 + 1)) + 0;
    }
    this.steps = this.getSteps(this.policy, this.transitions, this.initial_state, this.num_steps);
  }

  getSteps(policy: number[], transitions: number[][], initial_state: number, num_steps: number){
    let steps = [initial_state];
    let state = initial_state;
    for (let i =1; i<num_steps; i++){
      let new_state = transitions[state][policy[state]];
      steps.push(new_state);
      state = new_state;
    }
    return steps;
  }

  calculate_policy(transitions: number[][], rewards: number[][], discount_factor: number) {
    // let V = rewards.map(x => x[0]);
    let V = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let policy = [];
    let new_policy = this.argmax(rewards, discount_factor, V, transitions);
    let updated = true;
    let i = 0;
    while (updated && i < 100) {
      policy = new_policy;
      for (let s in V) {
        V[s] = rewards[s][policy[s]] + discount_factor * V[transitions[s][policy[s]]];
      }
      new_policy = this.argmax(rewards, discount_factor, V, transitions);
      console.log(policy);
      if (this.arraysEqual(new_policy, policy)) {
        updated = false;
      }
      i++;
    }
    return new_policy;
  }

  argmax(r: number[][], gamma: number, v: number[], delta: number[][]) {
    let a_max = 0,
      pi = [],
      max;
    for (let s in r) {
      for (let a in r[s]) {
        let tmp = r[s][a] + gamma * v[delta[s][a]];
        if (!max || tmp > max) {
          max = tmp;
          a_max = parseInt(a);
        }
      }
      pi[s] = a_max;
    }
    return pi;
  }

  arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length)
      return false;
    for (var i = arr1.length; i--;) {
      if (arr1[i] !== arr2[i])
        return false;
    }
    return true;
  }
}
