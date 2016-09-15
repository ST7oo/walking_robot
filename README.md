# Walking Robot

[Live demo](https://walkingrobot.herokuapp.com/)

## Install
```bash

# Install dependencies
npm install && npm run typings

# run and watch for changes in .ts files
npm start

# Applciation url: http://localhost:3000
```

## Development
Uncomment in `public/index.html`:

```html
<script src="js/systemjs.config.js"></script>
<script>
  System.import('main')
        .then(null, console.error.bind(console));
</script>
```

Comment out
```html
<!-- Production mod -->
<script src="js/bundle.min.js"></script>
```

After modifying code run
```bash
npm run bundle:prod
```
and comment/uncomment again in `public/index.html`