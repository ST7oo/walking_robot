import { Component, OnInit } from '@angular/core';
import * as math from 'mathjs';


@Component({
    selector: 'my-home',
    templateUrl: 'components/home/home.component.html'
})
export class HomeComponent implements OnInit {

	num_policies = 5;
	num_states = 16;
	num_actions = 4;
  discount_factor: number = 0.5;
	learning_rate: number = 0.1;
	exploration_rate: number = 0.2;
	states = [[0, 1, 2, 3],
		[4, 5, 6, 7],
		[8, 9, 10, 11],
		[12, 13, 14, 15]];
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

	calculatingV = true;
  calculatingQ = true;
  calculatingQlearning = true;
  calculatingQlearning_greedy = true;
	show_parameters = [true, false, false];
  initial_state = 0;
  num_steps = 20;
	speed = 800;
	T = 10000;
	max_iterations = 200;
	random_max = 10;
	iterations_V: number;
	iterations_Q: number;
  policyV: number[] = [];
  policyQ: number[] = [];
  policyQlearning: number[] = [];
  policyQlearning_greedy: number[] = [];
	best_policy = [0, 1, 0, 2, 3, 2, 0, 1, 2, 2, 0, 1, 0, 3, 3, 0];
  steps: Array<number>[] = Array(this.num_policies);
	animations: any[] = Array(this.num_policies);
	current_steps: number[] = Array(this.num_policies);
	playing: boolean[] = Array(this.num_policies);
	
	ngOnInit() {
		for (let i = 0; i < this.num_policies; i++) {
			this.playing[i] = false;
		}
    setTimeout(() => {
      this.calculate_policies();
    }, 1000);
		// for (let i = 0; i < this.num_states; i++) {
		// 	let image = new Image();
		// 	image.src = `app/img/step${i}.png`;
		// }
  }

	calculate_policies() {
		this.calculatingV = true;
		this.calculatingQ = true;
		this.calculatingQlearning = true;
		this.calculatingQlearning_greedy = true;
		for (let i = 0; i < this.num_policies; i++) {
			this.reset_animation(i);
		}
		[this.policyV, this.iterations_V] = this.calculate_policyV(this.transitions, this.rewards, this.discount_factor, this.num_states, this.num_actions, this.max_iterations);
		this.calculatingV = false;
		[this.policyQ, this.iterations_Q] = this.calculate_policyQ(this.transitions, this.rewards, this.discount_factor, this.num_states, this.num_actions, this.max_iterations, this.random_max);
		this.calculatingQ = false;
		this.policyQlearning = this.calculate_Qlearning(math.randomInt(this.num_states - 1), this.T, this.exploration_rate, this.learning_rate, this.discount_factor, this.num_states, this.num_actions, this.random_max);
		this.calculatingQlearning = false;
		this.policyQlearning_greedy = this.calculate_Qlearning(math.randomInt(this.num_states - 1), this.T, this.exploration_rate, this.learning_rate, this.discount_factor, this.num_states, this.num_actions, this.random_max, true);
		this.calculatingQlearning_greedy = false;
	}

  simulate(random: boolean) {
    if (random) {
      this.initial_state = math.randomInt(this.num_states - 1);
    }
    this.steps[0] = this.getSteps(this.best_policy, this.transitions, this.initial_state, this.num_steps);
    this.steps[1] = this.getSteps(this.policyV, this.transitions, this.initial_state, this.num_steps);
    this.steps[2] = this.getSteps(this.policyQ, this.transitions, this.initial_state, this.num_steps);
    this.steps[3] = this.getSteps(this.policyQlearning, this.transitions, this.initial_state, this.num_steps);
    this.steps[4] = this.getSteps(this.policyQlearning_greedy, this.transitions, this.initial_state, this.num_steps);
		// animate
		for (let i = 0; i < this.num_policies; i++) {
			this.reset_animation(i);
			this.play_animation(i);
		}
  }

	play_animation(num: number) {
		clearInterval(this.animations[num]);
		this.playing[num] = true;
		this.animations[num] = setInterval(() => {
			if (this.current_steps[num] == -1) {
				this.reset_animation(num);
				this.play_animation(num);
			} else {
				if (this.current_steps[num] + 1 == this.num_steps) {
					this.current_steps[num] = -1;
				} else {
					this.current_steps[num]++;
				}
			}
		}, this.speed);
	}

	pause_animation(num: number) {
		clearInterval(this.animations[num]);
		this.playing[num] = false;
	}

	reset_animation(num: number) {
		clearInterval(this.animations[num]);
		this.current_steps[num] = 0;
		this.playing[num] = false;
	}

	step_forward(num: number, steps: number) {
		if (this.current_steps[num] + steps >= this.num_steps) {
			this.current_steps[num] = -1;
		} else {
			this.current_steps[num] += steps;
		}
	}

	random_initial_state() {
		this.initial_state = math.randomInt(this.num_states - 1);
	}

	toggle_parameters(param: number) {
		this.show_parameters[param] = !this.show_parameters[param];
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

  calculate_policyV(transitions: number[][], rewards: number[][], discount_factor: number, num_states: number, num_actions: number, max_iterations: number): [number[], number] {
    let V = math.randomInt([num_states], num_actions - 1);
    let policy: number[] = Array(num_states);
    let new_policy: number[] = Array(num_states);
		for (let s in rewards) {
			new_policy[s] = this.argmax(rewards[s], (a: number) => rewards[s][a] + discount_factor * V[transitions[s][a]]);
		}
    let i = 0;
    while (!math.deepEqual(new_policy, policy) && i < max_iterations) {
      policy = math.clone(new_policy);
      for (let s in V) {
        V[s] = rewards[s][policy[s]] + discount_factor * V[transitions[s][policy[s]]];
				new_policy[s] = this.argmax(rewards[s], (a: number) => rewards[s][a] + discount_factor * V[transitions[s][a]]);
      }
      i++;
    }
    return [new_policy, i];
  }

  calculate_policyQ(transitions: number[][], rewards: number[][], discount_factor: number, num_states: number, num_actions: number, max_iterations: number, random_max: number): [number[], number] {
    let Q = math.randomInt([num_states, num_actions], random_max);
    let policy: number[] = [];
    let new_policy: number[] = Array(num_states);
		for (let s in Q) {
			new_policy[s] = this.argmax(Q[s], (a: number) => Q[s][a]);
		}
    let i = 0;
    while (!math.deepEqual(new_policy, policy) && i < max_iterations) {
      policy = math.clone(new_policy);
      for (let s in Q) {
        for (let a in Q[s]) {
          Q[s][a] = rewards[s][a] + discount_factor * math.max(Q[transitions[s][a]]);
        }
				new_policy[s] = this.argmax(Q[s], (a: number) => Q[s][a]);
      }
      i++;
    }
    return [new_policy, i];
  }

	calculate_Qlearning(initial_state: number, T: number, exploration_rate: number, learning_rate: number, discount_factor: number, num_states: number, num_actions: number, random_max: number, greedy = false) {
		let action: number, new_state: number, reward: number;
		let policy = Array(num_states);
		let epsilon = exploration_rate;
		let Q = math.randomInt([num_states, num_actions], random_max);
		let state = initial_state;
		for (let t = 0; t < T; t++) {
			if (!greedy && math.random() < epsilon) {
				action = math.randomInt(num_actions - 1);
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