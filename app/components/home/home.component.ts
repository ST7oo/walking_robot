import { Component, OnInit } from '@angular/core';
import * as math from 'mathjs';


@Component({
	selector: 'my-home',
	templateUrl: 'components/home/home.component.html'
})
export class HomeComponent implements OnInit {

	/* VARIABLES */

	policies_names = ['V', 'Q', 'Qlearning', 'Qlearning_greedy']; // policies to calculate
	// default parameters for policies 
  discount_factor: number = 0.3;
	learning_rate: number = 0.8;
	exploration_rate: number = 0.6;
	T = 5000; // iterations for Q learning
	num_actions = 4; // number of possible actions
	num_states = 16; // number of possible states
	states = [[0, 1, 2, 3],
		[4, 5, 6, 7],
		[8, 9, 10, 11],
		[12, 13, 14, 15]];
	range_states: number[] = Array.from(Array(this.num_states), (_, i) => i);
	// matrix of transitions
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
  // matrix of rewards
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
	calculating = true; // flag if it is calculating
	show_parameters = [true, false, false]; // show parameters panels
  initial_state = 0; // default initial state
  num_steps = 20; // number of steps for animation
	speed = 800; // speed of animation
	max_iterations = 200; // max iterations for V and Q
	random_max = 10; // max number for random initialization
  policies: number[][] = Array(this.policies_names.length); // policies
	iterations: number[] = Array(this.policies_names.length); // number of iterations taken to find the policy
  steps: Array<number>[] = Array(this.policies_names.length); // steps of animations
	animations: any[] = Array(this.policies_names.length); // JS intervals for animations
	current_steps: number[] = Array(this.policies_names.length); // current step of each animation
	playing: boolean[] = Array(this.policies_names.length); // if the animations are playing
	best_policy = [0, 1, 0, 2, 3, 0, 0, 1, 2, 2, 0, 1, 0, 1, 3, 0]; // policy for testing convergence
	optional_index = [0, 5, 6, 10, 13, 15]; // states where the best policy can change the action for action+2

	/* -- VARIABLES -- */


	/* FUNCTIONS */

	// initialization
	ngOnInit() {
		for (let p of this.policies_names) {
			this.playing[p] = false;
		}
    this.calculate_policies();
		// this.test_exploration_rate();
  }

	// Policies

	// calculate policies
	calculate_policies() {
		this.calculating = true;
		for (let p of this.policies_names) {
			this.reset_animation(p);
		}
		this.steps = Array(this.policies_names.length);
		setTimeout(() => {
			[this.policies['V'], this.iterations['V']] = this.calculate_policyV(this.transitions, this.rewards, this.discount_factor, this.num_states, this.num_actions, this.max_iterations);
			[this.policies['Q'], this.iterations['Q']] = this.calculate_policyQ(this.transitions, this.rewards, this.discount_factor, this.num_states, this.num_actions, this.max_iterations, this.random_max);
			[this.policies['Qlearning'], this.iterations['Qlearning']] = this.calculate_Qlearning(math.randomInt(this.num_states - 1), this.T, this.exploration_rate, this.learning_rate, this.discount_factor, this.num_states, this.num_actions, this.random_max, false, this.best_policy, this.optional_index);
			[this.policies['Qlearning_greedy'], this.iterations['Qlearning_greedy']] = this.calculate_Qlearning(math.randomInt(this.num_states - 1), this.T, this.exploration_rate, this.learning_rate, this.discount_factor, this.num_states, this.num_actions, this.random_max, true, this.best_policy, this.optional_index);
			this.calculating = false;
		}, 10);
	}

	// calculate policy using V
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

	// calculate policy using Q
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

	// calculate policy using Q learning
	calculate_Qlearning(initial_state: number, T: number, exploration_rate: number, learning_rate: number, discount_factor: number, num_states: number, num_actions: number, random_max: number, greedy = false, best_policy?: number[], optional_index?: number[]) {
		let action: number, new_state: number, reward: number;
		let policy = Array(num_states);
		let epsilon = exploration_rate;
		let Q = math.randomInt([num_states, num_actions], random_max);
		let state = initial_state;
		let t = 1;
		while (t < T) {
			if (!greedy && math.random() < epsilon) {
				action = math.randomInt(num_actions - 1);
			} else {
				action = Q[state].indexOf(math.max(Q[state]));
			}
			epsilon = exploration_rate * (1 - t / T);
			[new_state, reward] = this.go(state, action);
			Q[state][action] = Q[state][action] + learning_rate * (reward + discount_factor * math.max(Q[new_state]) - Q[state][action]);
			state = new_state;
			if (best_policy && optional_index && this.converge_policy(Q, best_policy, optional_index, num_states)) {
				break;
			}
			t++;
		}
		for (let s in Q) {
			policy[s] = this.argmax(Q[s], (a: number) => Q[s][a]);
		}
		return [policy, t];
	}

	// check if a policy has converged to an optimal policy
	converge_policy(Q: any, best_policy: number[], optional_index: number[], num_states: number) {
		let policy = Array(num_states);
		let converged = true;
		for (let s in Q) {
			policy[s] = this.argmax(Q[s], (a: number) => Q[s][a]);
		}
		for (let i in best_policy) {
			if (optional_index.indexOf(parseInt(i)) == -1) {
				if (policy[i] != best_policy[i]) {
					converged = false;
					break;
				}
			} else {
				if (policy[i] != best_policy[i] && policy[i] != best_policy[i] + 2) {
					converged = false;
					break;
				}
			}
		}
		return converged;
	}

	// function to test the exploration rate (it prints in the browser console)
	test_exploration_rate(num_tests = 50) {
		for (let eps = 0.1; eps <= 0.9; eps += 0.1) {
			console.log(eps);
			let epsilon = 0;
			let conv = num_tests;
			for (let i = 0; i < num_tests; i++) {
				let p, iter;
				[p, iter] = this.calculate_Qlearning(math.randomInt(this.num_states - 1), this.T, eps, this.learning_rate, this.discount_factor, this.num_states, this.num_actions, this.random_max, false, this.best_policy, this.optional_index);
				if (iter < this.T){
					epsilon += iter;
				} else {
					conv--;
				}
			}
			console.log(epsilon / conv, conv / num_tests);
		}
	}

	// get the new state and reward after performing an action in the current state
	go(state: number, action: number) {
		let new_state = this.transitions[state][action];
		let reward = this.rewards[state][action];
		return [new_state, reward];
	}

	// get the position of the max element calculating a lambda function
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

	// Animations

	// get the steps and animate
  simulate() {
		for (let p of this.policies_names) {
			this.steps[p] = this.get_steps(this.policies[p], this.transitions, this.initial_state, this.num_steps);
			this.reset_animation(p);
			this.play_animation(p);
		}
  }

	// get the steps according with the policy
  get_steps(policy: number[], transitions: number[][], initial_state: number, num_steps: number) {
    let steps = [initial_state];
    let state = initial_state;
    for (let i = 1; i < num_steps; i++) {
      let new_state = transitions[state][policy[state]];
      steps.push(new_state);
      state = new_state;
    }
    return steps;
  }

	// play a single animation
	play_animation(name: string) {
		clearInterval(this.animations[name]);
		this.playing[name] = true;
		this.animations[name] = setInterval(() => {
			if (this.current_steps[name] == -1) {
				this.reset_animation(name);
				this.play_animation(name);
			} else {
				if (this.current_steps[name] + 1 == this.num_steps) {
					this.current_steps[name] = -1;
				} else {
					this.current_steps[name]++;
				}
			}
		}, this.speed);
	}

	// pause animation
	pause_animation(name: string) {
		clearInterval(this.animations[name]);
		this.playing[name] = false;
	}

	// reset and pause animation
	reset_animation(name: string) {
		clearInterval(this.animations[name]);
		this.current_steps[name] = 0;
		this.playing[name] = false;
	}

	// step forward animation
	step_forward(name: string, steps: number) {
		if (this.current_steps[name] + steps >= this.num_steps) {
			this.current_steps[name] = -1;
		} else {
			this.current_steps[name] += steps;
		}
	}

	// Aux

	// get a random initial state
	random_initial_state() {
		this.initial_state = math.randomInt(this.num_states - 1);
	}

	// show/hide parameters panel
	toggle_parameters(param: number) {
		this.show_parameters[param] = !this.show_parameters[param];
	}

	/* -- FUNCTIONS -- */

}