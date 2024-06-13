#!/usr/bin/env node

import inquirer from "inquirer";
import shell from "shelljs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

      if (answer.applicationType === "Single Page Application") {
        inquirer
          .prompt([
            {
              type: "list",
              name: "technology",
              message: "What technology do you want to use?",
              default: "React",
              choices: ["React", "Vue", "Angular", "Javascript"],
            },
          ])
          .then((answer) => {
            switch (answer.technology) {
              case "React":
                let reactConfig = {
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
                    reactConfig.domain = answer.auth0Domain;
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
                        reactConfig.clientId = answer.auth0ClientId;
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
                            reactConfig.audience = answer.auth0Audience;

                            if (
                              !reactConfig.domain ||
                              !reactConfig.clientId ||
                              !reactConfig.audience
                            ) {
                              console.log("Missing configuration! Exiting...");
                              return;
                            }
                            const configContent = JSON.stringify(
                              reactConfig,
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

                            // Construct the path to the spa/react folder in the installed package
                            const sourceFolder = path.resolve(
                              __dirname,
                              "spa/react"
                            );
                            const moveFolder = shell.exec(
                              `cp -r "${sourceFolder}"/* "./${reactFolder}/"`
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
                          });
                      });
                  });
                break;
              case "Vue":
                let vueConfig = {
                  domain: "",
                  clientId: "",
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
                    vueConfig.domain = answer.auth0Domain;
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
                        vueConfig.clientId = answer.auth0ClientId;
                        const configContent = JSON.stringify(
                          vueConfig,
                          null,
                          2
                        ); // convert object to string with 2 spaces indentation

                        console.log("Preparing the React application...");
                        const vueFolder = "auth0-vue-poc";
                        const createFolder = shell.exec(
                          `mkdir -p ${vueFolder}`
                        );
                        if (createFolder.code !== 0) {
                          console.log("Error creating the folder");
                          return;
                        }

                        // Construct the path to the spa/react folder in the installed package
                        const sourceFolder = path.resolve(__dirname, "spa/vue");
                        const moveFolder = shell.exec(
                          `cp -r "${sourceFolder}"/* "./${vueFolder}/"`
                        );
                        if (moveFolder.code !== 0) {
                          console.log("Error moving the files");
                          return;
                        }

                        shell.cd(`${vueFolder}`); // change directory
                        shell.echo(configContent).to("auth_config.json"); // create file and write content to it
                        console.log("Installing dependencies...");
                        shell.exec(`npm install`, { silent: true });
                        console.log("Starting the application...");
                        shell.exec(`npm run serve`);
                      });
                  });
                break;
              case "Angular":
                let angularConfig = {
                  domain: "",
                  clientId: "",
                  authorizationParams: {
                    audience: "",
                  },
                  apiUri: "http://localhost:3001",
                  appUri: "http://localhost:4200",
                  errorPath: "/error",
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
                    angularConfig.domain = answer.auth0Domain;
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
                        angularConfig.clientId = answer.auth0ClientId;
                        const configContent = JSON.stringify(
                          angularConfig,
                          null,
                          2
                        ); // convert object to string with 2 spaces indentation

                        console.log("Preparing the React application...");
                        const angularFolder = "auth0-angular-poc";
                        const createFolder = shell.exec(
                          `mkdir -p ${angularFolder}`
                        );
                        if (createFolder.code !== 0) {
                          console.log("Error creating the folder");
                          return;
                        }

                        // Construct the path to the spa/react folder in the installed package
                        const sourceFolder = path.resolve(
                          __dirname,
                          "spa/angular"
                        );
                        const moveFolder = shell.exec(
                          `cp -r "${sourceFolder}"/* "./${angularFolder}/"`
                        );
                        if (moveFolder.code !== 0) {
                          console.log("Error moving the files");
                          return;
                        }

                        shell.cd(`${angularFolder}`); // change directory
                        shell.echo(configContent).to("auth_config.json"); // create file and write content to it
                        console.log("Installing dependencies...");
                        shell.exec(`npm install`, { silent: true });
                        console.log("Starting the application...");
                        shell.exec(`npm run start`);
                      });
                  });
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
