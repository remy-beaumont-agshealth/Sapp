# ∫app

Define integration tests for [dpxdt](https://github.com/bslatkin/dpxdt)

[dpxdt](https://github.com/bslatkin/dpxdt) is a system that will take screenshots of your app, find any changes over time, and present a UI where you or your QA team can review and accept / reject any changes.  

Sapp is a system that will let you define screenshots with resolution sizes and a javascript function that can, for example, click buttons or otherwise interact with your site.

So, ∫app∙dpxdt is a complete integration of your app over pixels and time.

## Example test

```javascript
module.exports = {
    name : "Main Page: in which the button is clicked",
    url : "index.html",
    config : {
        viewportSize : {
            width : 1024,
            height : 768
        }
    },
    test : function() {
        $('#the-button').click();
    }
};
```

Sapp will read this test and cause dpxdt to go to `index.html` with a window at 1024 x 768, click the button, and then take a screenshot.  If that screenshot ever changes, dpxdt will let you know about it!

## Setup

There are going to be three apps:

- Your actual app that you care about
- dpxdt, an app that can take screenshots and compare them
- Sapp, a command-line tool that can scan your source code for test definitions and prepare them for dpxdt

All three apps are separate and communicate via HTTP.

### Set up dpxdt

1. Get dpxdt running as per the [getting started guide](https://github.com/bslatkin/dpxdt#getting-started).  This is a doozy of a step, but stick with it!  You're going to love it.

### Set up Sapp

1. Make sure you have the prerequisite node and npm installed.
1. Clone this repo into its own place:

        git clone https://github.com/rileylark/Sapp
        
1. Run `npm install` 


### (optional) Set up sample app if you just want to see what it looks like

1. `cd sampleSiteUnderTest`
1. `npm install`
1. `node server.js`

Now, you should have dpxdt running on localhost:5000, and this sample site running on localhost:3000.

### Run your integration test

        node Sapp.js sampleSiteUnderTest
        
The `sampleSiteUnderTest` is a path argument that tells Sapp where to look for test files.  Use `node Sapp.js --help` for a full list of options.

## Todo

I've already got [issues](https://github.com/rileylark/Sapp/issues), but please think of [some more](https://github.com/rileylark/Sapp/issues/new)

## License

Apache 2.  Whatevs!