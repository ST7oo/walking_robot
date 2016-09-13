import { Component } from '@angular/core';
import * as math from 'mathjs';

@Component({
	selector: 'my-app',
	templateUrl: 'app/app.component.html'
})
export class AppComponent {
	calculatingV = true;
  calculatingQ = true;
  calculatingQlearning = true;
  calculatingQlearning_greedy = true;
  discount_factor: number = 0.5;
	learning_rate: number = 0.1;
	exploration_rate: number = 0.2;
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
  policyQlearning: number[] = [];
  policyQlearning_greedy: number[] = [];
	best_policy = [0, 1, 0, 2, 3, 2, 0, 1, 2, 2, 0, 1, 0, 3, 3, 0];
	// best_policy = [0,1,0,2,3,0,2,3,2,2,0,1,0,3,1,0];
  num_steps = 20;
	T = 10000;
  steps0: number[] = [];
  steps1: number[] = [];
  steps2: number[] = [];
  steps3: number[] = [];
  steps4: number[] = [];

  ngOnInit() {
    setTimeout(() => {
      this.policyV = this.calculate_policyV(this.transitions, this.rewards, this.discount_factor);
      this.calculatingV = false;
      this.policyQ = this.calculate_policyQ(this.transitions, this.rewards, this.discount_factor);
      this.calculatingQ = false;
      this.policyQlearning = this.calculate_Qlearning(math.randomInt(15), this.T, this.exploration_rate, this.learning_rate, this.discount_factor);
      this.calculatingQlearning = false;
      this.policyQlearning_greedy = this.calculate_Qlearning(math.randomInt(15), this.T, this.exploration_rate, this.learning_rate, this.discount_factor, true);
      this.calculatingQlearning_greedy = false;
    }, 1000);
  }

  simulate(random: boolean) {
    if (random) {
      this.initial_state = math.randomInt(15);
    }
    this.steps0 = this.getSteps(this.best_policy, this.transitions, this.initial_state, this.num_steps);
    this.steps1 = this.getSteps(this.policyV, this.transitions, this.initial_state, this.num_steps);
    this.steps2 = this.getSteps(this.policyQ, this.transitions, this.initial_state, this.num_steps);
    this.steps3 = this.getSteps(this.policyQlearning, this.transitions, this.initial_state, this.num_steps);
    this.steps4 = this.getSteps(this.policyQlearning_greedy, this.transitions, this.initial_state, this.num_steps);
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

  calculate_policyV(transitions: number[][], rewards: number[][], discount_factor: number) {
    let V = math.randomInt([16], 3);
    let policy: number[] = Array(16);
    let new_policy: number[] = Array(16);
		for (let s in rewards) {
			new_policy[s] = this.argmax(rewards[s], (a: number) => rewards[s][a] + discount_factor * V[transitions[s][a]]);
		}
    let i = 0;
    while (!math.deepEqual(new_policy, policy) && i < 100) {
      policy = math.clone(new_policy);
      for (let s in V) {
        V[s] = rewards[s][policy[s]] + discount_factor * V[transitions[s][policy[s]]];
				new_policy[s] = this.argmax(rewards[s], (a: number) => rewards[s][a] + discount_factor * V[transitions[s][a]]);
      }
      i++;
    }
		console.log('V:', i);
    return new_policy;
  }

  calculate_policyQ(transitions: number[][], rewards: number[][], discount_factor: number) {
    let Q = math.randomInt([16, 4], 10);
    let policy: number[] = [];
    let new_policy: number[] = Array(16);
		for (let s in Q) {
			new_policy[s] = this.argmax(Q[s], (a: number) => Q[s][a]);
		}
    let i = 0;
    while (!math.deepEqual(new_policy, policy) && i < 100) {
      policy = math.clone(new_policy);
      for (let s in Q) {
        for (let a in Q[s]) {
          Q[s][a] = rewards[s][a] + discount_factor * math.max(Q[transitions[s][a]]);
        }
				new_policy[s] = this.argmax(Q[s], (a: number) => Q[s][a]);
      }
      i++;
    }
		console.log('Q:', i);
    return new_policy;
  }

	calculate_Qlearning(initial_state: number, T: number, exploration_rate: number, learning_rate: number, discount_factor: number, greedy = false) {
		let action: number, new_state: number, reward: number;
		let policy = Array(16);
		let epsilon = exploration_rate;
		let Q = math.randomInt([16, 4], 10);
		let state = initial_state;
		for (let t = 0; t < T; t++) {
			if (!greedy && math.random() < epsilon) {
				action = math.randomInt(3);
			} else {
				action = Q[state].indexOf(math.max(Q[state]));
			}
			epsilon = exploration_rate * (1 - t / T);
			[new_state, reward] = this.go(state, action);
			Q[state][action] = Q[state][action] + learning_rate * (reward + discount_factor * math.max(Q[new_state]) - Q[state][action]);
			state = new_state;
		}
		for (let s in Q) {
			policy[s] = this.argmax(Q[s], (a: number) => Q[s][a]);
		}
		return policy;
	}

	go(state: number, action: number) {
		let new_state = this.transitions[state][action];
		let reward = this.rewards[state][action];
		return [new_state, reward];
	}

  argmax(array: number[], lamda: Function) {
    let a_max: number,
      max: number;
		for (let a in array) {
			let tmp = lamda(a);
			if (!max || tmp > max) {
				max = tmp;
				a_max = parseInt(a);
			}
		}
    return a_max;
  }

}
