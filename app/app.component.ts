import { Component } from '@angular/core';

@Component({
    selector: 'my-app',
    templateUrl: 'app/app.component.html'
})
export class AppComponent {
	calculatingV = true;
  calculatingQ = true;
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
  /*rewards = [[0, -20, 0, -20], //0
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
   [0, -20, 0, -20]]; //15*/
  rewards = [[0, -10, 0, -10], //0
    [0, 0, -10, -10], //1
    [0, 0, -10, -10], //2
    [0, -10, 0, -10], //3
    [-10, -10, 0, 0], //4
    [0, -10, 0, -10], //5
    [0, -10, 0, -10], //6
    [-10, 10, 0, 0], //7
    [-10, -10, 0, 0], //8
    [0, -10, 0, -10], //9
    [0, -10, 0, -10], //10
    [-10, 10, 0, 0], //11
    [0, -10, 0, -10], //12
    [0, 0, -10, 10], //13
    [0, 0, -10, 10], //14
    [0, -10, 0, -10]]; //15


  initial_state: number;
  policyV: number[] = [];
  policyQ: number[] = [];
  num_steps = 20;
  steps1: number[] = [];
  steps2: number[] = [];

  ngOnInit() {
    setTimeout(() => {
      this.policyV = this.calculate_policy(this.transitions, this.rewards, this.discount_factor);
      this.calculatingV = false;
      this.policyQ = this.calculate_policy2(this.transitions, this.rewards, this.discount_factor);
      this.calculatingQ = false;
    }, 1000);
  }

  simulate(random: boolean) {
    if (random) {
      this.initial_state = Math.floor(Math.random() * (15 - 0 + 1)) + 0;
    }
    this.steps1 = this.getSteps(this.policyV, this.transitions, this.initial_state, this.num_steps);
    this.steps2 = this.getSteps(this.policyQ, this.transitions, this.initial_state, this.num_steps);
  }

  getSteps(policy: number[], transitions: number[][], initial_state: number, num_steps: number) {
    let steps = [initial_state];
    let state = initial_state;
    for (let i = 1; i < num_steps; i++) {
      let new_state = transitions[state][policy[state]];
      steps.push(new_state);
      state = new_state;
    }
    return steps;
  }

  calculate_policy(transitions: number[][], rewards: number[][], discount_factor: number) {
    // let V = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let V = this.randomArray(16, 3);
    let policy: number[] = [];
    let new_policy = this.argmax(rewards, discount_factor, V, transitions);
    let updated = true;
    let i = 0;
    while (updated && i < 100) {
      policy = new_policy;
      for (let s in V) {
        V[s] = rewards[s][policy[s]] + discount_factor * V[transitions[s][policy[s]]];
      }
      new_policy = this.argmax(rewards, discount_factor, V, transitions);
      // console.log(policy);
      if (this.arraysEqual(new_policy, policy)) {
        updated = false;
      }
      i++;
    }
    return new_policy;
  }

  calculate_policy2(transitions: number[][], rewards: number[][], discount_factor: number) {
    /*let Q = [[0, 0, 0, 0], //0
      [0, 0, 0, 0], //1
      [0, 0, 0, 0], //2
      [0, 0, 0, 0], //3
      [0, 0, 0, 0], //4
      [0, 0, 0, 0], //5
      [0, 0, 0, 0], //6
      [0, 0, 0, 0], //7
      [0, 0, 0, 0], //8
      [0, 0, 0, 0], //9
      [0, 0, 0, 0], //10
      [0, 0, 0, 0], //11
      [0, 0, 0, 0], //12
      [0, 0, 0, 0], //13
      [0, 0, 0, 0], //14
      [0, 0, 0, 0]]; //15*/
    let Q: number[][] = [];
     for (let j=0; j<16; j++){
     Q.push(this.randomArray(4, 3))
     }
    let policy: number[] = [];
    let new_policy = this.argmax2(Q);
    let updated = true;
    let i = 0;
    while (updated && i < 100) {
      policy = new_policy;
      // let oldQ = Object.assign({}, Q);
      for (let s in Q) {
        for (let a in Q[s]) {
          Q[s][a] = rewards[s][a] + discount_factor * Math.max(...Q[transitions[s][a]]);
        }
      }
      // console.log(oldQ);
      console.log(Q);
      new_policy = this.argmax2(Q);
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
      pi: number[] = [],
      max: number;
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

  argmax2(Q: number[][]) {
    let a_max = 0,
      pi: number[] = [],
      max: number;
    for (let s in Q) {
      for (let a in Q[s]) {
        let tmp = Q[s][a];
        if (!max || tmp > max) {
          max = tmp;
          a_max = parseInt(a);
        }
      }
      pi[s] = a_max;
    }
    return pi;
  }

  randomArray(length: number, max: number) {
    return Array.apply(null, Array(length)).map(function (_: any, i: any) {
      return Math.round(Math.random() * max);
    });
  }

  arraysEqual(arr1: any[], arr2: any[]) {
    if (arr1.length !== arr2.length)
      return false;
    for (var i = arr1.length; i--;) {
      if (arr1[i] !== arr2[i])
        return false;
    }
    return true;
  }
 }
