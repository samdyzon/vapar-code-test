# VAPAR - Code Test

Contained within this repository is my implementation of the Full Stack Developer Code Test - August 2025 for VAPAR.

## Requirements

In order to run this code, your machine must have the following installed:

* Python == 3.13
* [Poetry](https://python-poetry.org/docs/#installation) (Python dependency management)
* NodeJS >= v23.11
* Yarn == 3.5.0

## Assumptions

My development environment typically has the following setup for poetry config:

```
poetry config virtualenvs.in-project true
```

Which will create a `.venv` directory in the project root.
This makes life much easier when configuring VSCode

# Setup Instructions

You can use the VSCode `vpar.code-workspace` file to open the project using a multi-root workspace.
I set up the repository to work natively with VSCode.

Navigate to the project root directory in a terminal and run:

```
poetry install
yarn install
yarn build
```

This will install all Python dependencies in a virtual environment, install JS dependencies in `node_modules`, and execute a build of the Javascript for the application.

**You must also activate the virtual environment to run any commands below.** You can do this manually with:

```
source .venv/bin/activate
```

Or if you open the project workspace in VSCode, creating a new terminal should automatically activate the virtualenv.

# Running the Application

To run the application, navigate to the `application/vapar` directory and run the following:

```
python manage.py runserver
```

You can then navigate to [http://localhost:8000](http://localhost:8000).
If you have followed all of the instructions correctly, you should see and be able to use the search UI.

## Running the Tests

To run the unit tests, navigate to the `application` directory and run:

```
pytest
```

# Updating the UI and using Vite

The `yarn build` command will automatically transpile the UI using the `application/build.ts` configuration, and the application will handle serving the main HTML on the index page.
However, editing the javascript and then running `yarn build` is a terrible development experience.
You can use Vite to handle automatic reloading of the UI when changes are made.

First make sure that the application server is still running from above.
Then open a new terminal and run:

```
yarn workspace @vapar/frontend dev
```

Open your browser to [http://localhost:5173](http://localhost:5173) and you can see the same UI as the app.
The difference now is that you can make changes to the UI code and Vite will handle HMR for you.

# Development Notes

* The project structure might be a bit surprising - it is a structure and methodology that I developed over the last few years of app development. Structuring the project this way allows a monorepo approach to developing UI and App code in the same project, and makes heaps of stuff much easier (in my opinion). I'm happy to tell you all about it if you are interested.

* I also configured the repo to be as native to VSCode as possible - opening the workspace file will enable heaps of features that come with VSCode like recommended extensions and editor configurations.

* Look at `application/static/vapar.tsx` - this is another technique that I developed for handling the mounting of React components in a server-side rendered application (in Django). This methodology uses a tool called [StimulusJS](https://stimulus.hotwired.dev/) to handle mounting the react component.

    * Using this technique, I can use Django to serve the static HTML (`application/templates/index.html`) that you'd typically need a second server to handle (IE: Vite Dev Server). Hence why you only need to run the Django server to evaluate this project.

* I kept track of my work in the Git Logs, you can see that I finished most of the Python work quickly but spent most of my time on the JavaScript. I am not as familiar with `react-router` so I had to do some digging in the documentation and spent a while banging my head against the wall getting it all sorted. I'm also not a fantastic UI designer/developer so it took much longer to make the site look ok.

* My Typescript is not ideal, and I chose not to dig more into the types and documentation for the UI due to spending too much time on this.

* Overall, I believe I spent a bit more time then I meant to on this - **about 6 hours**. But I was having a lot of fun, so no worries.