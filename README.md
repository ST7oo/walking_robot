# Walking Robot

This is an application that shows a robot that learned to walk, using different reinforcement learning algorithms (function V, function Q, Q-learning). It is implemented in Angular 2. Here it is the [live demo](https://walkingrobot.herokuapp.com/).

## Install

 - Install [NodeJS](https://nodejs.org/).
 - Clone or download this repo.
 - Go to this directory.
 - Install dependencies
```bash
npm install && npm run typings
```
  - Start the server
```bash
npm start
```
  - Applciation url: http://localhost:3000


## Development

  - Uncomment in `public/index.html`:

```html
<script src="js/systemjs.config.js"></script>
<script>
  System.import('main')
        .then(null, console.error.bind(console));
</script>
```
  - Comment out
```html
<!-- Production mod -->
<script src="js/bundle.min.js"></script>
```
  - Modify the code and after run
```bash
npm run bundle:prod
```
  - And comment/uncomment again in `public/index.html`