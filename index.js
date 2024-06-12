#!/usr/bin/env node

import inquirer from "inquirer";
import shell from "shelljs";

inquirer
  .prompt([
    {
      type: "list",
      name: "applicationType",
      message: "Auth0 application type:",
      default: "Single Page Application",
      choices: [
        "Single Page Application",
        "Regular Web Application",
        "Machine to Machine",
        "Native Application",
      ],
    },
  ])
  .then(async (answer) => {
    try {
      const gitVersion = shell.exec(
        `
      git -v
    `,
        { silent: true }
      );

      if (gitVersion.code !== 0) {
        console.log("Git is not installed! Please install it and try again.");
        return;
      }

      const npmVersion = shell.exec(`npm -v`, { silent: true });
      if (npmVersion.code !== 0) {
        console.log("NPM is not installed! Please install it and try again.");
        return;
      }

      const tempFolderName = "temp-clone-folder";

      if (answer.applicationType === "Single Page Application") {
        inquirer
          .prompt([
            {
              type: "list",
              name: "technology",
              message: "What technology do you want to use?",
              default: "React",
              choices: ["React", "Angular", "Vue", "Javascript"],
            },
          ])
          .then((answer) => {
            switch (answer.technology) {
              case "React":
                let config = {
                  domain: "",
                  clientId: "",
                  audience: "",
                };
                inquirer
                  .prompt({
                    type: "question",
                    name: "auth0Domain",
                    message: "Auth0/Tenant Domain: ",
                  })
                  .then((answer) => {
                    if (!answer.auth0Domain) {
                      console.log("No domain provided! Exiting...");
                      return;
                    }
                    config.domain = answer.auth0Domain;
                    inquirer
                      .prompt({
                        type: "question",
                        name: "auth0ClientId",
                        message: "clientId: ",
                      })
                      .then((answer) => {
                        if (!answer.auth0ClientId) {
                          console.log("No clientId provided! Exiting...");
                          return;
                        }
                        config.clientId = answer.auth0ClientId;
                        inquirer
                          .prompt({
                            type: "question",
                            name: "auth0Audience",
                            message: "API Audience: ",
                          })
                          .then((answer) => {
                            if (!answer.auth0Audience) {
                              console.log("No audience provided! Exiting...");
                              return;
                            }
                            config.audience = answer.auth0Audience;

                            console.log("config: ", config);
                            if (
                              !config.domain ||
                              !config.clientId ||
                              !config.audience
                            ) {
                              console.log("Missing configuration! Exiting...");
                              return;
                            }
                            const configContent = JSON.stringify(
                              config,
                              null,
                              2
                            ); // convert object to string with 2 spaces indentation

                            console.log("Preparing the React application...");
                            const reactFolder = "auth0-react-poc";
                            const createFolder = shell.exec(
                              `mkdir -p ${reactFolder}`
                            );
                            if (createFolder.code !== 0) {
                              console.log("Error creating the folder");
                              return;
                            }
                            const moveFolder = shell.exec(
                              `cp -r "./spa/react/"* "./${reactFolder}/"`
                            );
                            if (moveFolder.code !== 0) {
                              console.log("Error moving the files");
                              return;
                            }
                            shell.cd(`${reactFolder}/src`); // change directory
                            shell.echo(configContent).to("auth_config.json"); // create file and write content to it
                            shell.cd("../"); // change directory
                            console.log("Installing dependencies...");
                            shell.exec(`npm install`, { silent: true });
                            console.log("Starting the application...");
                            shell.exec(`npm run start`);
                            // shell.exec("npm install"); // install dependencies
                            // shell.exec("npm start"); // start the application
                          });
                      });
                  });
                break;
              case "Angular":
                console.log("Not supported yet");
                break;
              case "Vue":
                console.log("Not supported yet");
                break;
              case "Javascript":
                console.log("Not supported yet");
                break;
              default:
                console.log("Not supported yet");
            }
          });
      } else {
        console.log("Not supported yet");
      }
    } catch (err) {
      console.log(err);
      console.log("Internal error! Exiting...");
    }
  });
