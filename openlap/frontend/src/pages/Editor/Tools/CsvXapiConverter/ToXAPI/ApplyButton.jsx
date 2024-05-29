import React, { useState } from "react";
import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

const ApplyButton = (props) => {
  const {
    rowData,
    setRows,
    handleUploadCSV,
    xapi,
    setXapi,
    checker,
    setChecker,
    allValid,
    setAllValid,
    errors,
    setErrors,
  } = props;

  //const dispatch = useDispatch();
  //const rowData = useSelector((state) => state.csvxapiReducer.data.rowData);
  // const columnDefs = useSelector(
  //   (state) => state.csvxapiReducer.data.columnDefs
  // );

  const form = useSelector((state) => state.csvxapiReducer.form);

  const combineStringParts = (stringParts, rowIndex) => {
    let result = "";
    stringParts.forEach((part) => {
      if (part.type == "TXT") {
        result = result + part.str;
      } else if (part.type == "CSV") {
        for (const [key, value] of Object.entries(rowIndex)) {
          if (key == part.str) {
            result = result + value;
          }
        }
      }
    });
    return result;
  };

  const handleApply = () => {
    const newXapi = [];
    let newChecker = [];
    setAllValid(true);

    const sha1 = require("js-sha1");
    const sha256 = require("js-sha256");

    let errArray = [];

    const uuidRegex = new RegExp(
      "/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/g"
    );

    const websiteRegex = new RegExp(
      "^https?://([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?"
      //"^\.$"
      //"^(https?:\/\/)?([-a-zA-Z0-9@:%._\+~#=]+\\.[-a-zA-Z0-9@:%._\+~#=]+)+$"
      //"^(https?:\/\/)?([-a-zA-Z0-9@:%._\+~#=].[-a-zA-Z0-9@:%._\+~#=])+(/[-a-zA-Z0-9@:%_\+.~#?&//=])*"
      //"^(https?:\/\/)?(www\.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)|(https?:\/\/)?(www\.)?(?!ww)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$"
      //"^https?:\/\/(www\.)?([-a-zA-Z0-9@:%._\+~#=]{1,256}\.)+[a-zA-Z0-9()]{1,6}[-a-zA-Z0-9()@:%_\+.~#?&\/=]*$"
      //"/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/g"
      //"/(https?://)?(www.)[-a-zA-Z0-9@:%._+~#=]{2,256}.[a-z]{2,4}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)|(https?://)?(www.)?(?!ww)[-a-zA-Z0-9@:%._+~#=]{2,256}.[a-z]{2,4}\b([-a-zA-Z0-9@:%_+.~#?&//=]*/g"
    );
    const mboxRegex = new RegExp(
      "^mailto:[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$"
    );
    //'/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$)/g'

    const sha1Regex = new RegExp("^[a-fA-F0-9]{40}$");

    const sha2Regex = new RegExp("^[a-fA-F0-9]{64}$");

    const basicResponsesRegex = new RegExp(
      "/^[-a-zA-Z0-9@:%._+~#=,]*([,][-a-zA-Z0-9@:%._+~#=,]+)*$/g"
    );
    const matchingResponsesRegex = new RegExp(
      "/^[-a-zA-Z0-9@:%._+~#=,]+[.][-a-zA-Z0-9@:%._+~#=,]+([,][-a-zA-Z0-9@:%._+~#=,]+[.][-a-zA-Z0-9@:%._+~#=,]+)*$/g"
    );

    const performanceResponsesRegex = new RegExp(
      "/^[-a-zA-Z0-9@:%._+~#=,]+[.](([-a-zA-Z0-9@:%._+~#=,]*([,][-a-zA-Z0-9@:%._+~#=,]+)*)|([0-9]*[.,]?[0-9]+([:])?[0-9]*[.,]?[0-9]*|[0-9]*[.,]?[0-9]*([:])?[0-9]*[.,]?[0-9]+))([,][-a-zA-Z0-9@:%._+~#=,]+[.](([-a-zA-Z0-9@:%._+~#=,]*([,][-a-zA-Z0-9@:%._+~#=,]+)*)|([0-9]*[.,]?[0-9]+([:])?[0-9]*[.,]?[0-9]*|[0-9]*[.,]?[0-9]*([:])?[0-9]*[.,]?[0-9]+)))*$/g"
    );

    const sequencingResponsesRegex = new RegExp(
      "/^[-a-zA-Z0-9@:%._+~#=,]*([,][-a-zA-Z0-9@:%._+~#=,]+)+$/g"
    );
    const likertResponsesRegex = new RegExp("/^[-a-zA-Z0-9@:%._+~#=,]*$/g");
    const numericResponsesRegex = new RegExp(
      "/^[0-9]*[.,]?[0-9]+([:])?[0-9]*[.,]?[0-9]*|[0-9]*[.,]?[0-9]*([:])?[0-9]*[.,]?[0-9]+$/g"
    );

    const scaleRegex = new RegExp("/^-?(0?[.,]?[0-9]*|1([.,]0*)?)$/g");

    const decimalRegex = new RegExp("/^-?([0-9]*[.,]?[0-9]*)$/g");

    const durationRegex = new RegExp(
      "^P(\\d+(?:\\.\\d+)?Y)?(\\d+(?:\\.\\d+)?M)?(\\d+(?:\\.\\d+)?D)?(T(\\d+(?:\\.\\d+)?H)?(\\d+(?:\\.\\d+)?M)?(\\d+(?:\\.\\d+)?S)?)?$|^P(\\d+(?:\\.\\d+)?W)?(T(\\d+(?:\\.\\d+)?H)?(\\d+(?:\\.\\d+)?M)?(\\d+(?:\\.\\d+)?S)?)?$"
      // "^P(?!$)(\\d+(?:\\.\\d+)?W)?(T(?=\\d)(\\d+(?:\\.\\d+)?H)?(\\d+(?:\\.\\d+)?M)?(\\d+(?:\\.\\d+)?S)?)?|^P(?!$)(\\d+(?:\\.\\d+)?Y)?(\\d+(?:\\.\\d+)?M)?(\\d+(?:\\.\\d+)?D)?(T(?=\\d)(\\d+(?:\\.\\d+)?H)?(\\d+(?:\\.\\d+)?M)?(\\d+(?:\\.\\d+)?S)?)?$"
      //"^P(?!$)(\\d+(?:\\.\\d+)?Y)?(\\d+(?:\\.\\d+)?M)?(\\d+(?:\\.\\d+)?W)?(\\d+(?:\\.\\d+)?D)?(T(?=\\d)(\\d+(?:\\.\\d+)?H)?(\\d+(?:\\.\\d+)?M)?(\\d+(?:\\.\\d+)?S)?)?$"
    );

    const timestampRegex = new RegExp(
      "^(\\d{4}-\\d{2}-\\d{2})?T\\d{2}:\\d{2}:\\d{2}(\\.\\d*)?([+-]{1}\\d{2}:\\d{2}|Z)?$"
      //"^(\\d{4}-\\d{2}-\\d{2})?T\\d{2}:\\d{2}:\\d{2}(\\.\\d*)?(Z|+\\d{2}:\\d{2}|-\\d{2}:\\d{2})?$"
      //"/^(?:[1-9]d{3}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1d|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[1-9]d(?:0[48]|[2468][048]|[13579][26])|(?:[2468][048]|[13579][26])00)-02-29)T(?:[01]d|2[0-3]):[0-5]d:[0-5]d(?:Z|[+-][01]d:[0-5]d)$/g"
    );

    const mediatypeRegex = new RegExp(
      "\\w+/[-+.\\w]+"
      //"\\w+/[-.\\w]+(?:\\+[-.\\w]+)?"
    );

    rowData.forEach((row) => {
      let json = {};
      let valid = true;
      errArray.push(" ");

      //ID///////////////////////////////////////////////////////////////////////////////////////

      if (form.id.selected) {
        json["id"] = combineStringParts(form.id.stringParts, rowData[row.id]);
        if (!uuidRegex.test(json.id)) {
          valid = false;
          errArray[row.id] = errArray[row.id] + "\n id (must be UUID)";
        }
      }

      // //ACTOR///////////////////////////////////////////////////////////////////////////////////////

      json["actor"] = {};

      if (form.actor.objecttype.selected) {
      json.actor["objectType"] = form.actor.objecttype.value;
      }

      if (form.actor.name.selected) {
        json.actor["name"] = combineStringParts(
          form.actor.name.stringParts,
          rowData[row.id]
        );
      } else {
        valid = false;
        errArray[row.id] = errArray[row.id] + "\n actor.name(required)";
      }

      switch (form.actor.ifi) {
        case "account":
          json.actor["account"] = {};

          if (form.actor.accountHomepage.selected) {
            json.actor.account["homePage"] = combineStringParts(
              form.actor.accountHomepage.stringParts,
              rowData[row.id]
            );
            if (!websiteRegex.test(json.actor.account.homePage)) {
              valid = false;
              errArray[row.id] =
                errArray[row.id] + "\n actor.account.homePage must be IRL";
            }
          } else {
            valid = false;
            errArray[row.id] =
              errArray[row.id] + "\n actor.account.homePage(required)";
          }

          if (form.actor.accountName.selected) {
            json.actor.account["name"] = combineStringParts(
              form.actor.accountName.stringParts,
              rowData[row.id]
            );
          }
          if (
            json.actor.account.name == "" ||
            json.actor.account.name == undefined
          ) {
            valid = false;
            errArray[row.id] =
              errArray[row.id] + "\n actor.account.name(required)";
          }

          break;
        case "mbox":
          json.actor["mbox"] = combineStringParts(
            form.actor.mbox.stringParts,
            rowData[row.id]
          );
          if (!mboxRegex.test(json.actor.mbox)) {
            valid = false;
            errArray[row.id] = errArray[row.id] + "\n actor.mbox";
          }
          break;
        case "mbox_sha1sum":
          json.actor["mbox_sha1sum"] = combineStringParts(
            form.actor.mbox_sha1sum.stringParts,
            rowData[row.id]
          );
          if (form.actor.mbox_sha1sum.generateSHA1) {
            json.actor.mbox_sha1sum = sha1(json.actor.mbox_sha1sum);
          }
          if (!sha1Regex.test(json.actor.mbox_sha1sum)) {
            valid = false;
            errArray[row.id] = errArray[row.id] + "\n actor.mbox_sha1sum";
          }
          break;
        case "openid":
          json.actor["openid"] = combineStringParts(
            form.actor.openid.stringParts,
            rowData[row.id]
          );
          if (!websiteRegex.test(json.actor.openid)) {
            valid = false;
            errArray[row.id] = errArray[row.id] + "\n actor.openid";
          }
          break;
        default:
          valid = false;
          errArray[row.id] = errArray[row.id] + "\n actor.ifi(required)";
      }

      if (form.actor.objecttype.value == "Group") {
        json.actor.members = [];

        form.actor.members.array.forEach((member) => {
          const m = {};

          m["objectType"] = "Agent";

          if (member.name.selected) {
            m["name"] = combineStringParts(
              member.name.stringParts,
              rowData[row.id]
            );
          }

          switch (member.ifi) {
            case "account":
              m["account"] = {};
              if (member.accountHomepage.selected) {
                m.account["homePage"] = combineStringParts(
                  member.accountHomepage.stringParts,
                  rowData[row.id]
                );
                if (!websiteRegex.test(m.account.homePage)) {
                  valid = false;
                  errArray[row.id] =
                    errArray[row.id] +
                    "\n actor.members.account.homePage must be IRL";
                }
              } else {
                valid = false;
                errArray[row.id] =
                  errArray[row.id] +
                  "\n actor.members.account.homePage(required)";
              }

              if (member.accountName.selected) {
                m.account["name"] = combineStringParts(
                  member.accountName.stringParts,
                  rowData[row.id]
                );
              }
              if (m.account.name == "" || m.account.name == undefined) {
                valid = false;
                errArray[row.id] =
                  errArray[row.id] + "\n actor.account.members.name(required)";
              }
              break;
            case "mbox":
              m["mbox"] = combineStringParts(
                member.mbox.stringParts,
                rowData[row.id]
              );
              if (!mboxRegex.test(m.mbox)) {
                valid = false;
                errArray[row.id] = errArray[row.id] + "\n actor.members.mbox";
              }
              break;
            case "mbox_sha1sum":
              m["mbox_sha1sum"] = combineStringParts(
                member.mbox_sha1sum.stringParts,
                rowData[row.id]
              );
              if (member.mbox_sha1sum.generateSHA1) {
                m.mbox_sha1sum = sha1(m.mbox_sha1sum);
              }
              if (!sha1Regex.test(m.mbox_sha1sum)) {
                valid = false;
                errArray[row.id] =
                  errArray[row.id] + "\n actor.members.mbox_sha1sum";
              }
              break;
            case "openid":
              m["openid"] = combineStringParts(
                member.openid.stringParts,
                rowData[row.id]
              );
              if (!websiteRegex.test(m.openid)) {
                valid = false;
                errArray[row.id] = errArray[row.id] + "\n actor.members.openid";
              }
              break;
            default:
              valid = false;
              errArray[row.id] =
                errArray[row.id] + "\n actor.members.ifi(required)";
          }

          json.actor.members.push(m);
        });
      }

      //VERB///////////////////////////////////////////////////////////////////////////////////////////

      json["verb"] = {};

      if (form.verb.id.selected) {
        json.verb["id"] = combineStringParts(
          form.verb.id.stringParts,
          rowData[row.id]
        );
        if (!websiteRegex.test(json.verb.id)) {
          valid = false;
          errArray[row.id] = errArray[row.id] + "\n verb.id must be IRL";
        }
      } else {
        valid = false;
        errArray[row.id] = errArray[row.id] + "\n verb.id(required)";
      }

      if(form.verb.display.selected){
        json.verb["display"] = {};
        for (const [key, value] of Object.entries(form.verb.display.languages)) {
          json.verb.display[key] = combineStringParts(value, rowData[row.id]);
        }
      }else{
        valid = false;
        errArray[row.id] = errArray[row.id] + "\n verb.display(required)";        
      }


      //OBJECT////////////////////////////////////////////////////////////////////////////////////////

      json["object"] = {};

      json.object["objectType"] = "Activity";

      if (form.object.id.selected) {
        json.object["id"] = combineStringParts(
          form.object.id.stringParts,
          rowData[row.id]
        );
        if (!websiteRegex.test(json.object.id)) {
          valid = false;
          errArray[row.id] = errArray[row.id] + "\n object.id must be IRL";
        }
      } else {
        valid = false;
        errArray[row.id] = errArray[row.id] + "\n object.definition.id(required)";
      }

      json.object["definition"] = {};

      if (form.object.definitionName.selected) {
        json.object.definition["name"] = {};

        for (const [key, value] of Object.entries(
          form.object.definitionName.languages
        )) {
          json.object.definition.name[key] = combineStringParts(
            value,
            rowData[row.id]
          );
        }
      } else {
        valid = false;
        errArray[row.id] =
          errArray[row.id] + "\n object.definition.name(required)";
      }

      if (form.object.definitionDescription.selected) {
        json.object.definition["description"] = {};

        for (const [key, value] of Object.entries(
          form.object.definitionDescription.languages
        )) {
          json.object.definition.description[key] = combineStringParts(
            value,
            rowData[row.id]
          );
        }
      } else {
        valid = false;
        errArray[row.id] =
          errArray[row.id] + "\n object.definition.description(required)";
      }

      if (form.object.definitionType.selected) {
        json.object.definition["type"] = combineStringParts(
          form.object.definitionType.stringParts,
          rowData[row.id]
        );
        if (!websiteRegex.test(json.object.definition.type)) {
          valid = false;
          errArray[row.id] =
            errArray[row.id] + "\n object.definition.type must be IRL";
        }
      } else {
        valid = false;
        errArray[row.id] =
          errArray[row.id] + "\n object.definition.type(required)";
      }

      if (form.object.definitionMoreinfo.selected) {
        json.object.definition["moreInfo"] = combineStringParts(
          form.object.definitionMoreinfo.stringParts,
          rowData[row.id]
        );
        if (!websiteRegex.test(json.object.definition.moreInfo)) {
          valid = false;
          errArray[row.id] = errArray[row.id] + "\n object.definition.moreInfo";
        }
      }

      if (form.object.definitionInteractiontype.selected) {
        json.object.definition["interactionType"] =
          form.object.definitionInteractiontype.value;

        if (form.object.definitionCorrectresponses.selected) {
          json.object.definition.correctResponsesPattern = [];

          if (json.object.definition.interactionType == "likert") {
            if (!form.object.definitionScales.selected) {
              valid = false;
              errArray[row.id] =
                errArray[row.id] + "\n object.definition.scales(required)";
            } else {
              json.object.definition.scale = [];

              form.object.definitionScales.array.forEach((item) => {
                const i = {};

                i["id"] = combineStringParts(item.id, rowData[row.id]);

                i["description"] = {};

                for (const [key, value] of Object.entries(item.description)) {
                  i.description[key] = combineStringParts(
                    value,
                    rowData[row.id]
                  );
                }
                json.object.definition.scale.push(i);
              });

              form.object.definitionCorrectresponses.array.forEach((obj) => {
                let s =
                  json.object.definition.scale[obj.stringParts.scales].id;
                json.object.definition.correctResponsesPattern.push(s);
              });
            }
          }

          if (
            json.object.definition.interactionType == "choice" ||
            json.object.definition.interactionType == "sequencing"
          ) {
            if (!form.object.definitionChoices.selected) {
              valid = false;
              errArray[row.id] =
                errArray[row.id] + "\n object.definition.choices(required)";
            } else {
              json.object.definition.choices = [];

              form.object.definitionChoices.array.forEach((item) => {
                const i = {};

                i["id"] = combineStringParts(item.id, rowData[row.id]);

                i["description"] = {};

                for (const [key, value] of Object.entries(item.description)) {
                  i.description[key] = combineStringParts(
                    value,
                    rowData[row.id]
                  );
                }

                json.object.definition.choices.push(i);
              });

              form.object.definitionCorrectresponses.array.forEach((obj) => {
                let s = json.object.definition.choices[obj.components[0]].id;

                for (let i = 1; i < obj.components.length; i++) {
                  s =
                    s +
                    "[,]" +
                    json.object.definition.choices[obj.components[i]].id;
                }
                json.object.definition.correctResponsesPattern.push(s);
              });
            }
          }

          if (json.object.definition.interactionType == "matching") {
            if (
              !form.object.definitionSources.selected ||
              !form.object.definitionTargets.selected
            ) {
              valid = false;
              errArray[row.id] =
                errArray[row.id] +
                "\n object.definition.sources&targets(required)";
            } else {
              json.object.definition.sources = [];

              form.object.definitionSources.array.forEach((item) => {
                const i = {};

                i["id"] = combineStringParts(item.id, rowData[row.id]);

                i["description"] = {};

                for (const [key, value] of Object.entries(item.description)) {
                  i.description[key] = combineStringParts(
                    value,
                    rowData[row.id]
                  );
                }

                json.object.definition.sources.push(i);
              });

              json.object.definition.targets = [];

              form.object.definitionTargets.array.forEach((item) => {
                const i = {};

                i["id"] = combineStringParts(item.id, rowData[row.id]);

                i["description"] = {};

                for (const [key, value] of Object.entries(item.description)) {
                  i.description[key] = combineStringParts(
                    value,
                    rowData[row.id]
                  );
                }

                json.object.definition.targets.push(i);
              });

              form.object.definitionCorrectresponses.array.forEach((obj) => {
                let s =
                  json.object.definition.sources[obj.components[0].source].id +
                  "[.]" +
                  json.object.definition.sources[obj.components[0].target].id;

                for (let i = 1; i < obj.components.length; i++) {
                  s =
                    s +
                    "[,]" +
                    json.object.definition.sources[obj.components[i].source]
                      .id +
                    "[.]" +
                    json.object.definition.sources[obj.components[i].target].id;
                }
                json.object.definition.correctResponsesPattern.push(s);
              });
            }
          }

          if (json.object.definition.interactionType == "performance") {
            if (!form.object.definitionSteps.selected) {
              valid = false;
              errArray[row.id] =
                errArray[row.id] + "\n object.definition.steps(required)";
            } else {
              json.object.definition.steps = [];

              form.object.definitionSteps.array.forEach((item) => {
                const i = {};

                i["id"] = combineStringParts(item.id, rowData[row.id]);

                i["description"] = {};

                for (const [key, value] of Object.entries(item.description)) {
                  i.description[key] = combineStringParts(
                    value,
                    rowData[row.id]
                  );
                }

                json.object.definition.steps.push(i);
              });

              form.object.definitionCorrectresponses.array.forEach((obj) => {
                let response = combineStringParts(
                  obj.components[0].stringParts,
                  rowData[row.id]
                );

                let s =
                  json.object.definition.steps[obj.components[0].step].id +
                  "[.]" +
                  response;

                for (let i = 1; i < obj.components.length; i++) {
                  response = combineStringParts(
                    obj.components[i].stringParts,
                    rowData[row.id]
                  );

                  s =
                    s +
                    "[,]" +
                    json.object.definition.steps[obj.components[i].step].id +
                    "[.]" +
                    response;
                }

                if (!numericResponsesRegex.test(response)) {
                  if (!obj.lang == "") {
                    s = "{lang=" + obj.lang + "} " + s;
                  }
                  if (obj.order_matters == false) {
                    s = "{order_matters=false} " + s;
                  }
                }
                json.object.definition.correctResponsesPattern.push(s);
              });
            }
          }

          if (
            json.object.definition.interactionType == "fill-in" ||
            json.object.definition.interactionType == "long-fill-in"
          ) {
            form.object.definitionCorrectresponses.array.forEach((obj) => {
              let s = combineStringParts(obj.stringParts, rowData[row.id]);

              if (!obj.lang == "") {
                s = "{lang=" + obj.lang + "} " + s;
              }
              if (obj.order_matters == false) {
                s = "{order_matters=false} " + s;
              }
              if (obj.case_matters == true) {
                s = "{case_matters=true} " + s;
              }

              json.object.definition.correctResponsesPattern.push(s);
            });
          }

          if (
            json.object.definition.interactionType == "true-false" ||
            json.object.definition.interactionType == "numeric" ||
            json.object.definition.interactionType == "other"
          ) {
            form.object.definitionCorrectresponses.array.forEach((obj) => {
              let s = combineStringParts(obj.stringParts, rowData[row.id]);
              json.object.definition.correctResponsesPattern.push(s);

              switch (json.object.definition.interactionType) {
                case "true-false":
                  if (s !== "true" && s !== "false") {
                    valid = false;
                    errArray[row.id] =
                      errArray[row.id] +
                      "\n object.definition.correctResponses must be true or false";
                  }
                  break;
                case "numeric":
                  if (!numericResponsesRegex.test(s)) {
                    valid = false;
                  }
                  break;
                case "other":
                  break;
                default:
              }
            });
          }
        }
      }

      if (form.object.definitionExtension.selected) {
        json.object.definition["extensions"] =
          form.object.definitionExtension.json;
        for (const [key, value] of Object.entries(
          form.object.definitionExtension.json
        )) {
          if (!websiteRegex.test(key)) {
            valid = false;
            errArray[row.id] =
              errArray[row.id] +
              "\n object.definition.extension(keys must be URI)";
          }
        }
      }

      // //CONTEXT////////////////////////////////////////////////////////////////////////////////////////

      json["context"] = {};

      if (form.context.registration.selected) {
        json.context["registration"] = combineStringParts(
          form.context.registration.stringParts,
          rowData[row.id]
        );
        if (!uuidRegex.test(json.context.registration)) {
          valid = false;
          errArray[row.id] =
            errArray[row.id] + "\n context.registration must be UUID";
        }
      }

      if (form.context.revision.selected) {
        json.context["revision"] = combineStringParts(
          form.context.revision.stringParts,
          rowData[row.id]
        );
      }

      if (form.context.platform.selected) {
        json.context["platform"] = combineStringParts(
          form.context.platform.stringParts,
          rowData[row.id]
        );
      }else{
        valid = false;
        errArray[row.id] = errArray[row.id] + "\n context.platform(required)";
      }

      if (form.context.language.selected) {
        json.context["language"] = form.context.language.tag;
      }else{
        errArray[row.id] =
        errArray[row.id] +
        "\n context.language(required)";
      }

      if (form.context.instructor.selected) {
        json.context["instructor"] = {};

        json.context.instructor["objectType"] =
          form.context.instructor.objecttype.value;

        if (form.context.instructor.name.selected) {
          json.context.instructor["name"] = combineStringParts(
            form.context.instructor.name.stringParts,
            rowData[row.id]
          );
        }

        switch (form.context.instructor.ifi) {
          case "account":
            json.context.instructor["account"] = {};

            if (form.context.instructor.accountHomepage.selected) {
              json.context.instructor.account["homePage"] = combineStringParts(
                form.context.instructor.accountHomepage.stringParts,
                rowData[row.id]
              );
              if (
                !websiteRegex.test(json.context.instructor.account.homePage)
              ) {
                valid = false;
                errArray[row.id] =
                  errArray[row.id] +
                  "\n context.instructor.account.homePage must be IRL";
              }
            } else {
              valid = false;
              errArray[row.id] =
                errArray[row.id] +
                "\n context.instructor.account.homePage(required)";
            }

            if (form.context.instructor.accountName.selected) {
              json.context.instructor.account["name"] = combineStringParts(
                form.context.instructor.accountName.stringParts,
                rowData[row.id]
              );
            } else {
              valid = false;
              errArray[row.id] =
                errArray[row.id] + "\n context.instructor.account.name(required)";
            }

            break;
          case "mbox":
            json.context.instructor["mbox"] = combineStringParts(
              form.context.instructor.mbox.stringParts,
              rowData[row.id]
            );
            if (!mboxRegex.test(json.context.instructor.mbox)) {
              valid = false;
              errArray[row.id] = errArray[row.id] + "\n context.instructor.mbox";
            }
            break;
          case "mbox_sha1sum":
            json.context.instructor["mbox_sha1sum"] = combineStringParts(
              form.context.instructor.mbox_sha1sum.stringParts,
              rowData[row.id]
            );
            if (form.context.instructor.mbox_sha1sum.generateSHA1) {
              json.context.instructor.mbox_sha1sum = sha1(
                json.context.instructor.mbox_sha1sum
              );
            }
            if (!sha1Regex.test(json.context.instructor.mbox_sha1sum)) {
              valid = false;
              errArray[row.id] =
                errArray[row.id] + "\n context.instructor.mbox_sha1sum";
            }
            break;
          case "openid":
            json.context.instructor["openid"] = combineStringParts(
              form.context.instructor.openid.stringParts,
              rowData[row.id]
            );
            if (!websiteRegex.test(json.context.instructor.openid)) {
              valid = false;
              errArray[row.id] =
                errArray[row.id] + "\n context.instructor.openid";
            }
            break;
          default:
            valid = false;
            errArray[row.id] =
              errArray[row.id] + "\n context.instructor.ifi(required)";
        }
      }

      if (form.context.instructor.objecttype.value == "Group") {
        json.context.instructor.members = [];

        form.context.instructor.members.array.forEach((member) => {
          const m = {};

          m["objectType"] = "Agent";

          if (member.name.selected) {
            m["name"] = combineStringParts(
              member.name.stringParts,
              rowData[row.id]
            );
          }

          switch (member.ifi) {
            case "account":
              m["account"] = {};
              if (member.accountHomepage.selected) {
                m.account["homePage"] = combineStringParts(
                  member.accountHomepage.stringParts,
                  rowData[row.id]
                );
                if (!websiteRegex.test(m.account.homePage)) {
                  valid = false;
                  errArray[row.id] =
                    errArray[row.id] +
                    "\n context.instructor.members.account.homePage must be IRL";
                }
              } else {
                valid = false;
                errArray[row.id] =
                  errArray[row.id] +
                  "\n context.instructor.members.account.homePage(required)";
              }
              if (member.accountName.selected) {
                m.account["name"] = combineStringParts(
                  member.accountName.stringParts,
                  rowData[row.id]
                );
                if (m.account.name == "" || m.account.name == undefined) {
                  valid = false;
                  errArray[row.id] =
                    errArray[row.id] +
                    "\n context.instructor.members.account.name(required)";
                }
              }

              break;
            case "mbox":
              m["mbox"] = combineStringParts(
                member.mbox.stringParts,
                rowData[row.id]
              );
              if (!mboxRegex.test(m.mbox)) {
                valid = false;
                errArray[row.id] =
                  errArray[row.id] + "\n context.instructor.members.mbox";
              }
              break;
            case "mbox_sha1sum":
              m["mbox_sha1sum"] = combineStringParts(
                member.mbox_sha1sum.stringParts,
                rowData[row.id]
              );
              if (member.mbox_sha1sum.generateSHA1) {
                m.mbox_sha1sum = sha1(m.mbox_sha1sum);
              }
              if (!sha1Regex.test(m.mbox_sha1sum)) {
                valid = false;
                errArray[row.id] =
                  errArray[row.id] + "\n context.instructor.members.mbox_sha1sum";
              }
              break;
            case "openid":
              m["openid"] = combineStringParts(
                member.openid.stringParts,
                rowData[row.id]
              );
              if (!websiteRegex.test(m.openid)) {
                valid = false;
                errArray[row.id] =
                  errArray[row.id] + "\n context.instructor.members.openid";
              }
              break;
            default:
              valid = false;
              errArray[row.id] =
                errArray[row.id] + "\n context.instructor.members.ifi(required)";
          }

          json.context.instructor.members.push(m);
        });
      }

      if (form.context.members.selected) {
        json.context["team"] = {};
        json.context.team["members"] = [];

        form.context.members.array.forEach((member) => {
          let m = {};

          m["objectType"] = "Agent";

          if (member.name.selected) {
            m["name"] = combineStringParts(
              member.name.stringParts,
              rowData[row.id]
            );
          }

          switch (member.ifi) {
            case "account":
              m["account"] = {};
              if (member.accountHomepage.selected) {
                m.account["homePage"] = combineStringParts(
                  member.accountHomepage.stringParts,
                  rowData[row.id]
                );
                if (!websiteRegex.test(m.account.homePage)) {
                  valid = false;
                  errArray[row.id] =
                    errArray[row.id] +
                    "\n context.team.members.account.homePage must be IRL";
                }
              } else {
                valid = false;
                errArray[row.id] =
                  errArray[row.id] +
                  "\n context.team.members.account.homePage(required)";
              }
              if (member.accountName.selected) {
                m.account["name"] = combineStringParts(
                  member.accountName.stringParts,
                  rowData[row.id]
                );
              } else {
                valid = false;
                errArray[row.id] =
                  errArray[row.id] +
                  "\n context.team.members.account.name(required)";
              }
              break;
            case "mbox":
              m["mbox"] = combineStringParts(
                member.mbox.stringParts,
                rowData[row.id]
              );
              if (!mboxRegex.test(m.mbox)) {
                valid = false;
                errArray[row.id] =
                  errArray[row.id] + "\n context.team.members.mbox";
              }
              break;
            case "mbox_sha1sum":
              m["mbox_sha1sum"] = combineStringParts(
                member.mbox_sha1sum.stringParts,
                rowData[row.id]
              );
              if (member.mbox_sha1sum.generateSHA1) {
                m.mbox_sha1sum = sha1(m.mbox_sha1sum);
              }
              if (!sha1Regex.test(m.mbox_sha1sum)) {
                valid = false;
                errArray[row.id] =
                  errArray[row.id] + "\n context.team.members.mbox_sha1sum";
              }
              break;
            case "openid":
              m["openid"] = combineStringParts(
                member.openid.stringParts,
                rowData[row.id]
              );
              if (!websiteRegex.test(m.openid)) {
                valid = false;
                errArray[row.id] =
                  errArray[row.id] + "\n context.team.members.openid";
              }
              break;
            default:
              valid = false;
              errArray[row.id] =
                errArray[row.id] + "\n context.team.members.ifi(required)";
          }

          json.context.team.members.push(m);
        });
      }

      if (form.context.extension.selected) {
        json.context["extensions"] = form.context.extension.json;
        for (const [key, value] of Object.entries(form.context.extension.json)) {
          if (!websiteRegex.test(key)) {
            valid = false;
            errArray[row.id] =
              errArray[row.id] + "\n context.extension(keys must be URI)";
          }
        }
      }

      if (
        form.context.contextActivitiesParent.selected ||
        form.context.contextActivitiesGrouping.selected ||
        form.context.contextActivitiesCategory.selected ||
        form.context.contextActivitiesOther.selected
      ) {
        json.context.contextActivities = {};

        if (form.context.contextActivitiesParent.selected) {
          json.context.contextActivities["parent"] = [];
          let p = {};

          p["objectType"] = "Activity";


          form.context.contextActivitiesParent.array.forEach((item) => {
            if (item.id.selected) {
              p["id"] = combineStringParts(
                item.id.stringParts,
                rowData[row.id]
              );
              if (!websiteRegex.test(p.id)) {
                valid = false;
                errArray[row.id] =
                  errArray[row.id] +
                  "\n context.contextActivities.parent.id must be IRL";
              }
            } else {
              valid = false;
              errArray[row.id] =
                errArray[row.id] +
                "\n context.contextActivities.parent.id(required)";
            }

            p["definition"] = {};

            if (item.definitionName.selected) {
              p.definition["name"] = {};

              for (const [key, value] of Object.entries(
                item.definitionName.languages
              )) {
                p.definition.name[key] = combineStringParts(
                  value,
                  rowData[row.id]
                );
              }
            }

            if (item.definitionDescription.selected) {
              p.definition["description"] = {};

              for (const [key, value] of Object.entries(
                item.definitionDescription.languages
              )) {
                p.definition.description[key] = combineStringParts(
                  value,
                  rowData[row.id]
                );
              }
            } else {
              valid = false;
              errArray[row.id] =
                errArray[row.id] +
                "\n context.contextActivities.parent.definition.description(required)";
            }

            if (item.definitionType.selected) {
              p.definition["type"] = combineStringParts(
                item.definitionType.stringParts,
                rowData[row.id]
              );
              if (!websiteRegex.test(p.definition.type)) {
                valid = false;
                errArray[row.id] =
                  errArray[row.id] +
                  "\n context.contextActivities.parent.definition.type must be IRL";
              }
            }

            if (item.definitionMoreinfo.selected) {
              p.definition["moreInfo"] = combineStringParts(
                item.definitionMoreinfo.stringParts,
                rowData[row.id]
              );
              if (!websiteRegex.test(p.definition.moreInfo)) {
                valid = false;
                errArray[row.id] =
                  errArray[row.id] +
                  "\n context.contextActivities.parent.definition.moreInfo must be IRL";
              }
            }

            if (item.definitionInteractiontype.selected) {
              p.definition["interactionType"] =
                item.definitionInteractiontype.value;

              if (item.definitionCorrectresponses.selected) {
                p.definition.correctResponsesPattern = [];

                if (p.definition.interactionType == "likert") {
                  if (!item.definitionScales.selected) {
                    valid = false;
                    errArray[row.id] =
                      errArray[row.id] +
                      "\n context.contextActivities.parent.definition.scales(required)";
                  } else {
                    p.definition.scale = [];

                    item.definitionScales.array.forEach((item) => {
                      const i = {};

                      i["id"] = combineStringParts(item.id, rowData[row.id]);

                      i["description"] = {};

                      for (const [key, value] of Object.entries(
                        item.description
                      )) {
                        i.description[key] = combineStringParts(
                          value,
                          rowData[row.id]
                        );
                      }

                      p.definition.scale.push(i);
                    });

                    item.definitionCorrectresponses.array.forEach((obj) => {
                      let s = p.definition.scale[obj.stringParts.scales].id;
                      p.definition.correctResponsesPattern.push(s);
                    });
                  }
                }

                if (
                  p.definition.interactionType == "choice" ||
                  p.definition.interactionType == "sequencing"
                ) {
                  if (!item.definitionChoices.selected) {
                    valid = false;
                    errArray[row.id] =
                      errArray[row.id] +
                      "\n context.contextActivities.parent.definition.choices(required)";
                  } else {
                    p.definition.choices = [];

                    item.definitionChoices.array.forEach((item) => {
                      const i = {};

                      i["id"] = combineStringParts(item.id, rowData[row.id]);

                      i["description"] = {};

                      for (const [key, value] of Object.entries(
                        item.description
                      )) {
                        i.description[key] = combineStringParts(
                          value,
                          rowData[row.id]
                        );
                      }

                      p.definition.choices.push(i);
                    });

                    item.definitionCorrectresponses.array.forEach((obj) => {
                      let s = p.definition.choices[obj.components[0]].id;

                      for (let i = 1; i < obj.components.length; i++) {
                        s =
                          s +
                          "[,]" +
                          p.definition.choices[obj.components[i]].id;
                      }
                      p.definition.correctResponsesPattern.push(s);
                    });
                  }
                }

                if (p.definition.interactionType == "matching") {
                  if (
                    !item.definitionSources.selected ||
                    !item.definitionTargets.selected
                  ) {
                    valid = false;
                    errArray[row.id] =
                      errArray[row.id] +
                      "\n context.contextActivities.parent.definition.sources&targets(required)";
                  } else {
                    p.definition.sources = [];

                    item.definitionSources.array.forEach((item) => {
                      const i = {};

                      i["id"] = combineStringParts(item.id, rowData[row.id]);

                      i["description"] = {};

                      for (const [key, value] of Object.entries(
                        item.description
                      )) {
                        i.description[key] = combineStringParts(
                          value,
                          rowData[row.id]
                        );
                      }

                      p.definition.sources.push(i);
                    });

                    p.definition.targets = [];

                    item.definitionTargets.array.forEach((item) => {
                      const i = {};

                      i["id"] = combineStringParts(item.id, rowData[row.id]);

                      i["description"] = {};

                      for (const [key, value] of Object.entries(
                        item.description
                      )) {
                        i.description[key] = combineStringParts(
                          value,
                          rowData[row.id]
                        );
                      }

                      p.definition.targets.push(i);
                    });

                    item.definitionCorrectresponses.array.forEach((obj) => {
                      let s =
                        p.definition.sources[obj.components[0].source].id +
                        "[.]" +
                        p.definition.targets[obj.components[0].target].id;

                    //if(obj.components.length>1){
                      for (let i = 1; i < obj.components.length; i++) {
                        s =
                          s +
                          "[,]" +
                          p.definition.sources[obj.components[i].source].id +
                          "[.]" +
                          p.definition.targets[obj.components[i].target].id;
                      }
                    //}
                      p.definition.correctResponsesPattern.push(s);
                    });
                  }
                }

                if (p.definition.interactionType == "performance") {
                  if (!item.definitionSteps.selected) {
                    valid = false;
                    errArray[row.id] =
                      errArray[row.id] +
                      "\n context.contextActivities.parent.definition.steps(required)";
                  } else {
                    p.definition.steps = [];

                    item.definitionSteps.array.forEach((item) => {
                      const i = {};

                      i["id"] = combineStringParts(item.id, rowData[row.id]);

                      i["description"] = {};

                      for (const [key, value] of Object.entries(
                        item.description
                      )) {
                        i.description[key] = combineStringParts(
                          value,
                          rowData[row.id]
                        );
                      }

                      p.definition.steps.push(i);
                    });

                    item.definitionCorrectresponses.array.forEach((obj) => {
                      let response = combineStringParts(
                        obj.components[0].stringParts,
                        rowData[row.id]
                      );

                      let s =
                        p.definition.steps[obj.components[0].step].id +
                        "[.]" +
                        response;

                      for (let i = 1; i < obj.components.length; i++) {
                        response = combineStringParts(
                          obj.components[i].stringParts,
                          rowData[row.id]
                        );

                        s =
                          s +
                          "[,]" +
                          p.definition.steps[obj.components[i].step].id +
                          "[.]" +
                          response;
                      }

                      if (!numericResponsesRegex.test(response)) {
                        if (!obj.lang == "") {
                          s = "{lang=" + obj.lang + "} " + s;
                        }
                        if (obj.order_matters == false) {
                          s = "{order_matters=false} " + s;
                        }
                      }
                      p.definition.correctResponsesPattern.push(s);
                    });
                  }
                }

                if (
                  p.definition.interactionType == "fill-in" ||
                  p.definition.interactionType == "long-fill-in"
                ) {
                  item.definitionCorrectresponses.array.forEach((obj) => {
                    let s = combineStringParts(
                      obj.stringParts,
                      rowData[row.id]
                    );

                    if (!obj.lang == "") {
                      s = "{lang=" + obj.lang + "} " + s;
                    }
                    if (obj.order_matters == false) {
                      s = "{order_matters=false} " + s;
                    }
                    if (obj.case_matters == true) {
                      s = "{case_matters=true} " + s;
                    }
                    p.definition.correctResponsesPattern.push(s);
                  });
                }

                if (
                  p.definition.interactionType == "true-false" ||
                  p.definition.interactionType == "numeric" ||
                  p.definition.interactionType == "other"
                ) {
                  item.definitionCorrectresponses.array.forEach((obj) => {
                    let s = combineStringParts(
                      obj.stringParts,
                      rowData[row.id]
                    );
                    p.definition.correctResponsesPattern.push(s);

                    switch (p.definition.interactionType) {
                      case "true-false":
                        if (s !== "true" && s !== "false") {
                          valid = false;
                          errArray[row.id] =
                            errArray[row.id] +
                            "\n context.contextActivities.parent.definition.correctResponses must be true or false";
                        }
                        break;
                      case "numeric":
                        if (!numericResponsesRegex.test(s)) {
                          valid = false;
                          errArray[row.id] =
                            errArray[row.id] +
                            "\n context.contextActivities.parent.definition.correctResponses must be num[:]num";
                        }
                        break;
                      case "other":
                        break;
                      default:
                    }
                  });
                }
              }
            }

            if (item.definitionExtension.selected) {
              p.definition["extensions"] = item.definitionExtension.json;
              for (const [key, value] of Object.entries(
                item.definitionExtension.json
              )) {
                if (!websiteRegex.test(key)) {
                  valid = false;
                  errArray[row.id] =
                    errArray[row.id] +
                    "\n context.contextActivities.parent.definition.extension(keys must be URI)";
                }
              }
            }

            json.context.contextActivities.parent.push(p);
          });
        }

        if (form.context.contextActivitiesGrouping.selected) {
          json.context.contextActivities["grouping"] = [];
          let g = {};

          g["objectType"] = "Activity";

          form.context.contextActivitiesGrouping.array.forEach((item) => {
            if (item.id.selected) {
              g["id"] = combineStringParts(
                item.id.stringParts,
                rowData[row.id]
              );
              if (!websiteRegex.test(g.id)) {
                valid = false;
                errArray[row.id] =
                  errArray[row.id] +
                  "\n context.contextActivities.grouping.id must be IRL";
              }
            } else {
              valid = false;
              errArray[row.id] =
                errArray[row.id] +
                "\n context.contextActivities.grouping.id(required)";
            }

            g["definition"] = {};

            if (item.definitionName.selected) {
              g.definition["name"] = {};

              for (const [key, value] of Object.entries(
                item.definitionName.languages
              )) {
                g.definition.name[key] = combineStringParts(
                  value,
                  rowData[row.id]
                );
              }
            }

            if (item.definitionDescription.selected) {
              g.definition["description"] = {};

              for (const [key, value] of Object.entries(
                item.definitionDescription.languages
              )) {
                g.definition.description[key] = combineStringParts(
                  value,
                  rowData[row.id]
                );
              }
            } else {
              valid = false;
              errArray[row.id] =
                errArray[row.id] +
                "\n context.contextActivities.grouping.definition.description(required)";
            }

            if (item.definitionType.selected) {
              g.definition["type"] = combineStringParts(
                item.definitionType.stringParts,
                rowData[row.id]
              );
              if (!websiteRegex.test(g.definition.type)) {
                valid = false;
                errArray[row.id] =
                  errArray[row.id] +
                  "\n context.contextActivities.grouping.definition.type must be IRL";
              }
            }

            if (item.definitionMoreinfo.selected) {
              g.definition["moreInfo"] = combineStringParts(
                item.definitionMoreinfo.stringParts,
                rowData[row.id]
              );
              if (!websiteRegex.test(g.definition.moreInfo)) {
                valid = false;
                errArray[row.id] =
                  errArray[row.id] +
                  "\n context.contextActivities.grouping.definition.moreInfo must be IRL";
              }
            }

            if (item.definitionInteractiontype.selected) {
              g.definition["interactionType"] =
                item.definitionInteractiontype.value;

              if (item.definitionCorrectresponses.selected) {
                g.definition.correctResponsesPattern = [];

                if (g.definition.interactionType == "likert") {
                  if (!item.definitionScales.selected) {
                    valid = false;
                    errArray[row.id] =
                      errArray[row.id] +
                      "\n context.contextActivities.grouping.definition.scales(required)";
                  } else {
                    g.definition.scale = [];

                    item.definitionScales.array.forEach((item) => {
                      const i = {};

                      i["id"] = combineStringParts(item.id, rowData[row.id]);

                      i["description"] = {};

                      for (const [key, value] of Object.entries(
                        item.description
                      )) {
                        i.description[key] = combineStringParts(
                          value,
                          rowData[row.id]
                        );
                      }

                      g.definition.scale.push(i);
                    });

                    item.definitionCorrectresponses.array.forEach((obj) => {
                      let s = g.definition.scale[obj.stringParts.scales].id;
                      g.definition.correctResponsesPattern.push(s);
                    });
                  }
                }

                if (
                  g.definition.interactionType == "choice" ||
                  g.definition.interactionType == "sequencing"
                ) {
                  if (!item.definitionChoices.selected) {
                    valid = false;
                    errArray[row.id] =
                      errArray[row.id] +
                      "\n context.contextActivities.grouping.definition.choices(required)";
                  } else {
                    g.definition.choices = [];

                    item.definitionChoices.array.forEach((item) => {
                      const i = {};

                      i["id"] = combineStringParts(item.id, rowData[row.id]);

                      i["description"] = {};

                      for (const [key, value] of Object.entries(
                        item.description
                      )) {
                        i.description[key] = combineStringParts(
                          value,
                          rowData[row.id]
                        );
                      }

                      g.definition.choices.push(i);
                    });

                    item.definitionCorrectresponses.array.forEach((obj) => {
                      let s = g.definition.choices[obj.components[0]].id;

                      for (let i = 1; i < obj.components.length; i++) {
                        s =
                          s +
                          "[,]" +
                          g.definition.choices[obj.components[i]].id;
                      }
                      g.definition.correctResponsesPattern.push(s);
                    });
                  }
                }

                if (g.definition.interactionType == "matching") {
                  if (
                    !item.definitionSources.selected ||
                    !item.definitionTargets.selected
                  ) {
                    valid = false;
                    errArray[row.id] =
                      errArray[row.id] +
                      "\n context.contextActivities.grouping.definition.sources&targets(required)";
                  } else {
                    g.definition.sources = [];

                    item.definitionSources.array.forEach((item) => {
                      const i = {};

                      i["id"] = combineStringParts(item.id, rowData[row.id]);

                      i["description"] = {};

                      for (const [key, value] of Object.entries(
                        item.description
                      )) {
                        i.description[key] = combineStringParts(
                          value,
                          rowData[row.id]
                        );
                      }

                      g.definition.sources.push(i);
                    });

                    g.definition.targets = [];

                    item.definitionTargets.array.forEach((item) => {
                      const i = {};

                      i["id"] = combineStringParts(item.id, rowData[row.id]);

                      i["description"] = {};

                      for (const [key, value] of Object.entries(
                        item.description
                      )) {
                        i.description[key] = combineStringParts(
                          value,
                          rowData[row.id]
                        );
                      }

                      g.definition.targets.push(i);
                    });

                    item.definitionCorrectresponses.array.forEach((obj) => {
                      let s =
                        g.definition.sources[obj.components[0].source].id +
                        "[.]" +
                        g.definition.targets[obj.components[0].target].id;

                      for (let i = 1; i < obj.components.length; i++) {
                        s =
                          s +
                          "[,]" +
                          g.definition.sources[obj.components[i].source].id +
                          "[.]" +
                          g.definition.targets[obj.components[i].target].id;
                      }
                      g.definition.correctResponsesPattern.push(s);
                    });
                  }
                }

                if (g.definition.interactionType == "performance") {
                  if (!item.definitionSteps.selected) {
                    valid = false;
                    errArray[row.id] =
                      errArray[row.id] +
                      "\n context.contextActivities.grouping.definition.steps(required)";
                  } else {
                    g.definition.steps = [];

                    item.definitionSteps.array.forEach((item) => {
                      const i = {};

                      i["id"] = combineStringParts(item.id, rowData[row.id]);

                      i["description"] = {};

                      for (const [key, value] of Object.entries(
                        item.description
                      )) {
                        i.description[key] = combineStringParts(
                          value,
                          rowData[row.id]
                        );
                      }

                      g.definition.steps.push(i);
                    });

                    item.definitionCorrectresponses.array.forEach((obj) => {
                      let response = combineStringParts(
                        obj.components[0].stringParts,
                        rowData[row.id]
                      );

                      let s =
                        g.definition.steps[obj.components[0].step].id +
                        "[.]" +
                        response;

                      for (let i = 1; i < obj.components.length; i++) {
                        response = combineStringParts(
                          obj.components[i].stringParts,
                          rowData[row.id]
                        );

                        s =
                          s +
                          "[,]" +
                          g.definition.steps[obj.components[i].step].id +
                          "[.]" +
                          response;
                      }

                      if (!numericResponsesRegex.test(response)) {
                        if (!obj.lang == "") {
                          s = "{lang=" + obj.lang + "} " + s;
                        }
                        if (obj.order_matters == false) {
                          s = "{order_matters=false} " + s;
                        }
                      }
                      g.definition.correctResponsesPattern.push(s);
                    });
                  }
                }

                if (
                  g.definition.interactionType == "fill-in" ||
                  g.definition.interactionType == "long-fill-in"
                ) {
                  item.definitionCorrectresponses.array.forEach((obj) => {
                    let s = combineStringParts(
                      obj.stringParts,
                      rowData[row.id]
                    );

                    if (!obj.lang == "") {
                      s = "{lang=" + obj.lang + "} " + s;
                    }
                    if (obj.order_matters == false) {
                      s = "{order_matters=false} " + s;
                    }
                    if (obj.case_matters == true) {
                      s = "{case_matters=true} " + s;
                    }

                    g.definition.correctResponsesPattern.push(s);
                  });
                }

                if (
                  g.definition.interactionType == "true-false" ||
                  g.definition.interactionType == "numeric" ||
                  g.definition.interactionType == "other"
                ) {
                  item.definitionCorrectresponses.array.forEach((obj) => {
                    let s = combineStringParts(
                      obj.stringParts,
                      rowData[row.id]
                    );
                    g.definition.correctResponsesPattern.push(s);

                    switch (g.definition.interactionType) {
                      case "true-false":
                        if (s !== "true" && s !== "false") {
                          valid = false;
                          errArray[row.id] =
                            errArray[row.id] +
                            "\n context.contextActivities.grouping.definition.correctResponses must be true or false";
                        }
                        break;
                      case "numeric":
                        if (!numericResponsesRegex.test(s)) {
                          valid = false;
                          errArray[row.id] =
                            errArray[row.id] +
                            "\n context.contextActivities.grouping.definition.correctResponses must be num[:]num";
                        }
                        break;
                      case "other":
                        break;
                      default:
                    }
                  });
                }
              }
            }

            if (item.definitionExtension.selected) {
              g.definition["extensions"] = item.definitionExtension.json;
              for (const [key, value] of Object.entries(
                item.definitionExtension.json
              )) {
                if (!websiteRegex.test(key)) {
                  valid = false;
                  errArray[row.id] =
                    errArray[row.id] +
                    "\n context.contextActivities.grouping.definition.extension(keys must be URI)";
                }
              }
            }

            json.context.contextActivities.grouping.push(g);
          });
        }

        if (form.context.contextActivitiesCategory.selected) {
          json.context.contextActivities["category"] = [];
          let c = {};

          c["objectType"] = "Activity";


          form.context.contextActivitiesCategory.array.forEach((item) => {
            if (item.id.selected) {
              c["id"] = combineStringParts(
                item.id.stringParts,
                rowData[row.id]
              );
              if (!websiteRegex.test(c.id)) {
                valid = false;
                errArray[row.id] =
                  errArray[row.id] +
                  "\n context.contextActivities.category.id must be IRL";
              }
            } else {
              valid = false;
              errArray[row.id] =
                errArray[row.id] +
                "\n context.contextActivities.category.id(required)";
            }

            c["definition"] = {};

            if (item.definitionName.selected) {
              c.definition["name"] = {};

              for (const [key, value] of Object.entries(
                item.definitionName.languages
              )) {
                c.definition.name[key] = combineStringParts(
                  value,
                  rowData[row.id]
                );
              }
            }

            if (item.definitionDescription.selected) {
              c.definition["description"] = {};

              for (const [key, value] of Object.entries(
                item.definitionDescription.languages
              )) {
                c.definition.description[key] = combineStringParts(
                  value,
                  rowData[row.id]
                );
              }
            } else {
              valid = false;
              errArray[row.id] =
                errArray[row.id] +
                "\n context.contextActivities.category.definition.description(required)";
            }

            if (item.definitionType.selected) {
              c.definition["type"] = combineStringParts(
                item.definitionType.stringParts,
                rowData[row.id]
              );
              if (!websiteRegex.test(c.definition.type)) {
                valid = false;
                errArray[row.id] =
                  errArray[row.id] +
                  "\n context.contextActivities.category.definition.type must be IRL";
              }
            }

            if (item.definitionMoreinfo.selected) {
              c.definition["moreInfo"] = combineStringParts(
                item.definitionMoreinfo.stringParts,
                rowData[row.id]
              );
              if (!websiteRegex.test(c.definition.moreInfo)) {
                valid = false;
                errArray[row.id] =
                  errArray[row.id] +
                  "\n context.contextActivities.category.definition.moreInfo must be IRL";
              }
            }

            if (item.definitionInteractiontype.selected) {
              c.definition["interactionType"] =
                item.definitionInteractiontype.value;

              if (item.definitionCorrectresponses.selected) {
                c.definition.correctResponsesPattern = [];

                if (c.definition.interactionType == "likert") {
                  if (!item.definitionScales.selected) {
                    valid = false;
                    errArray[row.id] =
                      errArray[row.id] +
                      "\n context.contextActivities.category.definition.scales(required)";
                  } else {
                    c.definition.scale = [];

                    item.definitionScales.array.forEach((item) => {
                      const i = {};

                      i["id"] = combineStringParts(item.id, rowData[row.id]);

                      i["description"] = {};

                      for (const [key, value] of Object.entries(
                        item.description
                      )) {
                        i.description[key] = combineStringParts(
                          value,
                          rowData[row.id]
                        );
                      }

                      c.definition.scale.push(i);
                    });

                    item.definitionCorrectresponses.array.forEach((obj) => {
                      let s = c.definition.scale[obj.stringParts.scales].id;
                      c.definition.correctResponsesPattern.push(s);
                    });
                  }
                }

                if (
                  c.definition.interactionType == "choice" ||
                  c.definition.interactionType == "sequencing"
                ) {
                  if (!item.definitionChoices.selected) {
                    valid = false;
                    errArray[row.id] =
                      errArray[row.id] +
                      "\n context.contextActivities.category.definition.choices(required)";
                  } else {
                    c.definition.choices = [];

                    item.definitionChoices.array.forEach((item) => {
                      const i = {};

                      i["id"] = combineStringParts(item.id, rowData[row.id]);

                      i["description"] = {};

                      for (const [key, value] of Object.entries(
                        item.description
                      )) {
                        i.description[key] = combineStringParts(
                          value,
                          rowData[row.id]
                        );
                      }

                      c.definition.choices.push(i);
                    });

                    item.definitionCorrectresponses.array.forEach((obj) => {
                      let s = c.definition.choices[obj.components[0]].id;

                      for (let i = 1; i < obj.components.length; i++) {
                        s =
                          s +
                          "[,]" +
                          c.definition.choices[obj.components[i]].id;
                      }
                      c.definition.correctResponsesPattern.push(s);
                    });
                  }
                }

                if (c.definition.interactionType == "matching") {
                  if (
                    !item.definitionSources.selected ||
                    !item.definitionTargets.selected
                  ) {
                    valid = false;
                    errArray[row.id] =
                      errArray[row.id] +
                      "\n context.contextActivities.category.definition.sources&targets(required)";
                  } else {
                    c.definition.sources = [];

                    item.definitionSources.array.forEach((item) => {
                      const i = {};

                      i["id"] = combineStringParts(item.id, rowData[row.id]);

                      i["description"] = {};

                      for (const [key, value] of Object.entries(
                        item.description
                      )) {
                        i.description[key] = combineStringParts(
                          value,
                          rowData[row.id]
                        );
                      }

                      c.definition.sources.push(i);
                    });

                    c.definition.targets = [];

                    item.definitionTargets.array.forEach((item) => {
                      const i = {};

                      i["id"] = combineStringParts(item.id, rowData[row.id]);

                      i["description"] = {};

                      for (const [key, value] of Object.entries(
                        item.description
                      )) {
                        i.description[key] = combineStringParts(
                          value,
                          rowData[row.id]
                        );
                      }

                      c.definition.targets.push(i);
                    });

                    item.definitionCorrectresponses.array.forEach((obj) => {
                      let s =
                        c.definition.sources[obj.components[0].source].id +
                        "[.]" +
                        c.definition.targets[obj.components[0].target].id;

                      for (let i = 1; i < obj.components.length; i++) {
                        s =
                          s +
                          "[,]" +
                          c.definition.sources[obj.components[i].source].id +
                          "[.]" +
                          c.definition.targets[obj.components[i].target].id;
                      }
                      c.definition.correctResponsesPattern.push(s);
                    });
                  }
                }

                if (c.definition.interactionType == "performance") {
                  if (!item.definitionSteps.selected) {
                    valid = false;
                    errArray[row.id] =
                      errArray[row.id] +
                      "\n context.contextActivities.category.definition.steps(required)";
                  } else {
                    c.definition.steps = [];

                    item.definitionSteps.array.forEach((item) => {
                      const i = {};

                      i["id"] = combineStringParts(item.id, rowData[row.id]);

                      i["description"] = {};

                      for (const [key, value] of Object.entries(
                        item.description
                      )) {
                        i.description[key] = combineStringParts(
                          value,
                          rowData[row.id]
                        );
                      }

                      c.definition.steps.push(i);
                    });

                    item.definitionCorrectresponses.array.forEach((obj) => {
                      let response = combineStringParts(
                        obj.components[0].stringParts,
                        rowData[row.id]
                      );

                      let s =
                        c.definition.steps[obj.components[0].step].id +
                        "[.]" +
                        response;

                      for (let i = 1; i < obj.components.length; i++) {
                        response = combineStringParts(
                          obj.components[i].stringParts,
                          rowData[row.id]
                        );

                        s =
                          s +
                          "[,]" +
                          c.definition.steps[obj.components[i].step].id +
                          "[.]" +
                          response;
                      }

                      if (!numericResponsesRegex.test(response)) {
                        if (!obj.lang == "") {
                          s = "{lang=" + obj.lang + "} " + s;
                        }
                        if (obj.order_matters == false) {
                          s = "{order_matters=false} " + s;
                        }
                      }
                      c.definition.correctResponsesPattern.push(s);
                    });
                  }
                }

                if (
                  c.definition.interactionType == "fill-in" ||
                  c.definition.interactionType == "long-fill-in"
                ) {
                  item.definitionCorrectresponses.array.forEach((obj) => {
                    let s = combineStringParts(
                      obj.stringParts,
                      rowData[row.id]
                    );

                    if (!obj.lang == "") {
                      s = "{lang=" + obj.lang + "} " + s;
                    }
                    if (obj.order_matters == false) {
                      s = "{order_matters=false} " + s;
                    }
                    if (obj.case_matters == true) {
                      s = "{case_matters=true} " + s;
                    }

                    c.definition.correctResponsesPattern.push(s);
                  });
                }

                if (
                  c.definition.interactionType == "true-false" ||
                  c.definition.interactionType == "numeric" ||
                  c.definition.interactionType == "other"
                ) {
                  item.definitionCorrectresponses.array.forEach((obj) => {
                    let s = combineStringParts(
                      obj.stringParts,
                      rowData[row.id]
                    );
                    c.definition.correctResponsesPattern.push(s);

                    switch (c.definition.interactionType) {
                      case "true-false":
                        if (s !== "true" && s !== "false") {
                          valid = false;
                          errArray[row.id] =
                            errArray[row.id] +
                            "\n context.contextActivities.category.definition.correctResponses must be true or false";
                        }
                        break;
                      case "numeric":
                        if (!numericResponsesRegex.test(s)) {
                          valid = false;
                          errArray[row.id] =
                            errArray[row.id] +
                            "\n context.contextActivities.category.definition.correctResponses must be num[:]num";
                        }
                        break;
                      case "other":
                        break;
                      default:
                    }
                  });
                }
              }
            }

            if (item.definitionExtension.selected) {
              c.definition["extensions"] = item.definitionExtension.json;
              for (const [key, value] of Object.entries(
                item.definitionExtension.json
              )) {
                if (!websiteRegex.test(key)) {
                  valid = false;
                  errArray[row.id] =
                    errArray[row.id] +
                    "\n context.contextActivities.category.definition.extension(keys must be URI)";
                }
              }
            }

            json.context.contextActivities.category.push(c);
          });
        }

        if (form.context.contextActivitiesOther.selected) {
          json.context.contextActivities["other"] = [];
          let o = {};

          o["objectType"] = "Activity";

          form.context.contextActivitiesOther.array.forEach((item) => {
            if (item.id.selected) {
              o["id"] = combineStringParts(
                item.id.stringParts,
                rowData[row.id]
              );
              if (!websiteRegex.test(o.id)) {
                valid = false;
                errArray[row.id] =
                  errArray[row.id] +
                  "\n context.contextActivities.other.id must be IRL";
              }
            } else {
              valid = false;
              errArray[row.id] =
                errArray[row.id] +
                "\n context.contextActivities.other.id(required)";
            }

            o["definition"] = {};

            if (item.definitionName.selected) {
              o.definition["name"] = {};

              for (const [key, value] of Object.entries(
                item.definitionName.languages
              )) {
                o.definition.name[key] = combineStringParts(
                  value,
                  rowData[row.id]
                );
              }
            }

            if (item.definitionDescription.selected) {
              o.definition["description"] = {};

              for (const [key, value] of Object.entries(
                item.definitionDescription.languages
              )) {
                o.definition.description[key] = combineStringParts(
                  value,
                  rowData[row.id]
                );
              }
            } else {
              valid = false;
              errArray[row.id] =
                errArray[row.id] +
                "\n context.contextActivities.other.definition.description(required)";
            }
            if (item.definitionType.selected) {
              o.definition["type"] = combineStringParts(
                item.definitionType.stringParts,
                rowData[row.id]
              );
              if (!websiteRegex.test(o.definition.type)) {
                valid = false;
                errArray[row.id] =
                  errArray[row.id] +
                  "\n context.contextActivities.other.definition.type must be IRL";
              }
            }

            if (item.definitionMoreinfo.selected) {
              o.definition["moreInfo"] = combineStringParts(
                item.definitionMoreinfo.stringParts,
                rowData[row.id]
              );
              if (!websiteRegex.test(o.definition.moreInfo)) {
                valid = false;
                errArray[row.id] =
                  errArray[row.id] +
                  "\n context.contextActivities.other.definition.moreInfo must be IRL";
              }
            }

            if (item.definitionInteractiontype.selected) {
              o.definition["interactionType"] =
                item.definitionInteractiontype.value;

              if (item.definitionCorrectresponses.selected) {
                o.definition.correctResponsesPattern = [];

                if (o.definition.interactionType == "likert") {
                  if (!item.definitionScales.selected) {
                    valid = false;
                    errArray[row.id] =
                      errArray[row.id] +
                      "\n context.contextActivities.other.definition.scales(required)";
                  } else {
                    o.definition.scale = [];

                    item.definitionScales.array.forEach((item) => {
                      const i = {};

                      i["id"] = combineStringParts(item.id, rowData[row.id]);

                      i["description"] = {};

                      for (const [key, value] of Object.entries(
                        item.description
                      )) {
                        i.description[key] = combineStringParts(
                          value,
                          rowData[row.id]
                        );
                      }

                      o.definition.scale.push(i);
                    });

                    item.definitionCorrectresponses.array.forEach((obj) => {
                      let s = o.definition.scale[obj.stringParts.scales].id;
                      o.definition.correctResponsesPattern.push(s);
                    });
                  }
                }

                if (
                  o.definition.interactionType == "choice" ||
                  o.definition.interactionType == "sequencing"
                ) {
                  if (!item.definitionChoices.selected) {
                    valid = false;
                    errArray[row.id] =
                      errArray[row.id] +
                      "\n context.contextActivities.other.definition.choices(required)";
                  } else {
                    o.definition.choices = [];

                    item.definitionChoices.array.forEach((item) => {
                      const i = {};

                      i["id"] = combineStringParts(item.id, rowData[row.id]);

                      i["description"] = {};

                      for (const [key, value] of Object.entries(
                        item.description
                      )) {
                        i.description[key] = combineStringParts(
                          value,
                          rowData[row.id]
                        );
                      }

                      o.definition.choices.push(i);
                    });

                    item.definitionCorrectresponses.array.forEach((obj) => {
                      let s = o.definition.choices[obj.components[0]].id;

                      for (let i = 1; i < obj.components.length; i++) {
                        s =
                          s +
                          "[,]" +
                          o.definition.choices[obj.components[i]].id;
                      }
                      o.definition.correctResponsesPattern.push(s);
                    });
                  }
                }

                if (o.definition.interactionType == "matching") {
                  if (
                    !item.definitionSources.selected ||
                    !item.definitionTargets.selected
                  ) {
                    valid = false;
                    errArray[row.id] =
                      errArray[row.id] +
                      "\n context.contextActivities.other.definition.sources&targets(required)";
                  } else {
                    o.definition.sources = [];

                    item.definitionSources.array.forEach((item) => {
                      const i = {};

                      i["id"] = combineStringParts(item.id, rowData[row.id]);

                      i["description"] = {};

                      for (const [key, value] of Object.entries(
                        item.description
                      )) {
                        i.description[key] = combineStringParts(
                          value,
                          rowData[row.id]
                        );
                      }

                      o.definition.sources.push(i);
                    });

                    o.definition.targets = [];

                    item.definitionTargets.array.forEach((item) => {
                      const i = {};

                      i["id"] = combineStringParts(item.id, rowData[row.id]);

                      i["description"] = {};

                      for (const [key, value] of Object.entries(
                        item.description
                      )) {
                        i.description[key] = combineStringParts(
                          value,
                          rowData[row.id]
                        );
                      }

                      o.definition.targets.push(i);
                    });

                    item.definitionCorrectresponses.array.forEach((obj) => {
                      let s =
                        o.definition.sources[obj.components[0].source].id +
                        "[.]" +
                        o.definition.targets[obj.components[0].target].id;

                      for (let i = 1; i < obj.components.length; i++) {
                        s =
                          s +
                          "[,]" +
                          o.definition.sources[obj.components[i].source].id +
                          "[.]" +
                          o.definition.targets[obj.components[i].target].id;
                      }
                      o.definition.correctResponsesPattern.push(s);
                    });
                  }
                }

                if (o.definition.interactionType == "performance") {
                  if (!item.definitionSteps.selected) {
                    valid = false;
                    errArray[row.id] =
                      errArray[row.id] +
                      "\n context.contextActivities.other.definition.steps(required)";
                  } else {
                    o.definition.steps = [];

                    item.definitionSteps.array.forEach((item) => {
                      const i = {};

                      i["id"] = combineStringParts(item.id, rowData[row.id]);

                      i["description"] = {};

                      for (const [key, value] of Object.entries(
                        item.description
                      )) {
                        i.description[key] = combineStringParts(
                          value,
                          rowData[row.id]
                        );
                      }

                      o.definition.steps.push(i);
                    });

                    item.definitionCorrectresponses.array.forEach((obj) => {
                      let response = combineStringParts(
                        obj.components[0].stringParts,
                        rowData[row.id]
                      );

                      let s =
                        o.definition.steps[obj.components[0].step].id +
                        "[.]" +
                        response;

                      for (let i = 1; i < obj.components.length; i++) {
                        response = combineStringParts(
                          obj.components[i].stringParts,
                          rowData[row.id]
                        );

                        s =
                          s +
                          "[,]" +
                          o.definition.steps[obj.components[i].step].id +
                          "[.]" +
                          response;
                      }

                      if (!numericResponsesRegex.test(response)) {
                        if (!obj.lang == "") {
                          s = "{lang=" + obj.lang + "} " + s;
                        }
                        if (obj.order_matters == false) {
                          s = "{order_matters=false} " + s;
                        }
                      }
                      o.definition.correctResponsesPattern.push(s);
                    });
                  }
                }

                if (
                  o.definition.interactionType == "fill-in" ||
                  o.definition.interactionType == "long-fill-in"
                ) {
                  item.definitionCorrectresponses.array.forEach((obj) => {
                    let s = combineStringParts(
                      obj.stringParts,
                      rowData[row.id]
                    );

                    if (!obj.lang == "") {
                      s = "{lang=" + obj.lang + "} " + s;
                    }
                    if (obj.order_matters == false) {
                      s = "{order_matters=false} " + s;
                    }
                    if (obj.case_matters == true) {
                      s = "{case_matters=true} " + s;
                    }

                    o.definition.correctResponsesPattern.push(s);
                  });
                }

                if (
                  o.definition.interactionType == "true-false" ||
                  o.definition.interactionType == "numeric" ||
                  o.definition.interactionType == "other"
                ) {
                  item.definitionCorrectresponses.array.forEach((obj) => {
                    let s = combineStringParts(
                      obj.stringParts,
                      rowData[row.id]
                    );
                    o.definition.correctResponsesPattern.push(s);

                    switch (o.definition.interactionType) {
                      case "true-false":
                        if (s !== "true" && s !== "false") {
                          valid = false;
                          errArray[row.id] =
                            errArray[row.id] +
                            "\n context.contextActivities.other.definition.correctResponses must be true or false";
                        }
                        break;
                      case "numeric":
                        if (!numericResponsesRegex.test(s)) {
                          valid = false;
                          errArray[row.id] =
                            errArray[row.id] +
                            "\n context.contextActivities.other.definition.correctResponses must be num[:]num";
                        }
                        break;
                      case "other":
                        break;
                      default:
                    }
                  });
                }
              }
            }

            if (item.definitionExtension.selected) {
              o.definition["extensions"] = item.definitionExtension.json;
              for (const [key, value] of Object.entries(
                item.definitionExtension.json
              )) {
                if (!websiteRegex.test(key)) {
                  valid = false;
                  errArray[row.id] =
                    errArray[row.id] +
                    "\n context.contextActivities.other.definition.extension(keys must be URI)";
                }
              }
            }

            json.context.contextActivities.other.push(o);
          });
        }
      }

      // //RESULT////////////////////////////////////////////////////////////////////////////////////////

      if (form.result.selected) {
        json["result"] = {};

        if (form.result.score.selected) {
          json.result["score"] = {};

          let scaled;
          let raw;
          let min;
          let max;

          if (form.result.score.min.selected) {
            json.result.score["min"] = combineStringParts(
              form.result.score.min.stringParts,
              rowData[row.id]
            );
            if (
              !(
                Boolean(Number(json.result.score.min)) ||
                json.result.score.min == "0"
              )
            ) {
              valid = false;
              errArray[row.id] =
                errArray[row.id] + "\n result.score.min(must be numerical)";
            } else {
              json.result.score.min = Number(json.result.score.min);
              min = json.result.score.min;
              //min = parseFloat(json.result.score.min);
            }
          }

          if (form.result.score.max.selected) {
            json.result.score["max"] = combineStringParts(
              form.result.score.max.stringParts,
              rowData[row.id]
            );
            if (
              !(
                Boolean(Number(json.result.score.max)) ||
                json.result.score.max == "0"
              )
            ) {
              valid = false;
              errArray[row.id] =
                errArray[row.id] + "\n result.score.max(must be numerical)";
            } else {
              json.result.score.max = Number(json.result.score.max);
              max = json.result.score.max;
              //max = parseFloat(json.result.score.max);
            }
          }

          if (
            form.result.score.min.selected &&
            form.result.score.max.selected
          ) {
            if (min > max) {
              valid = false;
              errArray[row.id] = errArray[row.id] + "\n result.score.min>max";
            }
          }

          if (form.result.score.raw.selected) {
            json.result.score["raw"] = combineStringParts(
              form.result.score.raw.stringParts,
              rowData[row.id]
            );
            if (
              !(
                Boolean(Number(json.result.score.raw)) ||
                json.result.score.raw == "0"
              )
            ) {
              valid = false;
              errArray[row.id] =
                errArray[row.id] + "\n result.score.raw(must be numerical)";
            } else {
              json.result.score.raw = Number(json.result.score.raw);
              raw = json.result.score.raw;
              //raw = parseFloat(json.result.score.raw);
              if (form.result.score.min.selected) {
                if (raw < min) {
                  valid = false;
                  errArray[row.id] = errArray[row.id] + "\n result.score.raw<min";
                }
              }
              if (form.result.score.max.selected) {
                if (raw > max) {
                  valid = false;
                  errArray[row.id] = errArray[row.id] + "\n result.score.raw>max";
                }
              }
            }
          }

          if (form.result.score.scaled.selected) {
            if (form.result.score.scaled.autogenerate) {
              if (
                !(
                  Boolean(Number(json.result.score.min)) ||
                  json.result.score.min == "0"
                ) ||
                !(
                  Boolean(Number(json.result.score.min)) ||
                  json.result.score.min == "0"
                ) ||
                !(
                  Boolean(Number(json.result.score.min)) ||
                  json.result.score.min == "0"
                )
              ) {
                errArray[row.id] =
                  errArray[row.id] +
                  "\n result.score.scaled(requires numerical raw, min, max to auto-generate)";
              } else {
                json.result.score["scaled"] =
                  2 *
                  ((json.result.score.raw - json.result.score.min) /
                    (json.result.score.max - json.result.score.min)) - 1; //zi = 2 * ((xi – xmin) / (xmax – xmin)) – 1
              }
            } else {
              json.result.score["scaled"] = combineStringParts(
                form.result.score.scaled.stringParts,
                rowData[row.id]
              );
            }
            if (!Boolean(Number(json.result.score.scaled))) {
              valid = false;
              errArray[row.id] =
                errArray[row.id] + "\n result.score.scaled(must be numerical)";
            } else {
              json.result.score.scaled = Number(json.result.score.scaled);
              scaled = json.result.score.scaled;
              //scaled = parseFloat(json.result.score.scaled);
              if (scaled > 1 || scaled < -1) {
                valid = false;
                errArray[row.id] =
                  errArray[row.id] + "\n result.score.scaled(out of range)";
              }
            }
          }
        }

        if (form.result.success.selected) {
          json.result["success"] = combineStringParts(
            form.result.success.stringParts,
            rowData[row.id]
          );
          if (json.result.success != "true" && json.result.success != "false") {
            valid = false;
            errArray[row.id] =
              errArray[row.id] + "\n result.score.success(not boolean)";
          }else{
            json.result.success = JSON.parse(json.result.success);
          }
        }
        if (form.result.completion.selected) {
          json.result["completion"] = combineStringParts(
            form.result.completion.stringParts,
            rowData[row.id]
          );
          if (
            json.result.completion != "true" &&
            json.result.completion != "false"
          ) {
            valid = false;
            errArray[row.id] =
              errArray[row.id] + "\n result.score.completion(not boolean)";
          }else{
            json.result.completion = JSON.parse(json.result.completion);
          }
        }
        if (form.result.response.selected) {
          json.result["response"] = combineStringParts(
            form.result.response.stringParts,
            rowData[row.id]
          );
        }
        if (form.result.duration.selected) {
          json.result["duration"] = combineStringParts(
            form.result.duration.stringParts,
            rowData[row.id]
          );
          if (!durationRegex.test(json.result.duration)) {
            valid = false;
            errArray[row.id] = errArray[row.id] + "\n result.score.duration";
          }
        }
      }

      if (form.result.extension.selected) {
        json.result["extensions"] = form.result.extension.json;
        for (const [key, value] of Object.entries(form.result.extension.json)) {
          if (!websiteRegex.test(key)) {
            valid = false;
            errArray[row.id] =
              errArray[row.id] + "\n result.extension(keys must be URI)";
          }
        }
      }

      // //TIMESTAMP///////////////////////////////////////////////////////////////////////////////////////

      if (form.timestamp.selected) {
        json["timestamp"] = combineStringParts(
          form.timestamp.stringParts,
          rowData[row.id]
        );
        if (!timestampRegex.test(json.timestamp)) {
          valid = false;
          errArray[row.id] = errArray[row.id] + "\n timestamp";
        }
      }

      // //ATTACHMENTS///////////////////////////////////////////////////////////////////////////////////////////

      if (form.attachments.selected) {

        json["attachments"] = [];


        form.attachments.array.forEach((att) => {
          const a = {};


        if (att.usageType.selected) {
          a["usageType"] = combineStringParts(
            att.usageType.stringParts,
            rowData[row.id]
          );
          if (!websiteRegex.test(a.usageType)) {
            valid = false;
            errArray[row.id] = errArray[row.id] + "\n attachments.usageType";
          }
        } else {
          valid = false;
          errArray[row.id] =
            errArray[row.id] + "\n attachments.usageType(required)";
        }

        if (att.display.selected) {
          a["display"] = {};
          for (const [key, value] of Object.entries(
            att.display.languages
          )) {
            a.display[key] = combineStringParts(
              value,
              rowData[row.id]
            );
          }
        } else {
          valid = false;
          errArray[row.id] =
            errArray[row.id] + "\n attachments.display(required)";
        }

        if (att.description.selected) {
          a["description"] = {};

          for (const [key, value] of Object.entries(
            att.description.languages
          )) {
            a.description[key] = combineStringParts(
              value,
              rowData[row.id]
            );
          }
        }

        if (att.contentType.selected) {
          a["contentType"] = combineStringParts(
            att.contentType.stringParts,
            rowData[row.id]
          );
          if (!mediatypeRegex.test(a.contentType)) {
            valid = false;
            errArray[row.id] = errArray[row.id] + "\n attachments.contentType";
          }
        } else {
          valid = false;
          errArray[row.id] =
            errArray[row.id] + "\n attachments.contentType(required)";
        }

        if (att.length.selected) {
          a["length"] = combineStringParts(
            att.length.stringParts,
            rowData[row.id]
          );
          if (!Boolean(Number(a.length))) {
            valid = false;
            errArray[row.id] =
              errArray[row.id] + "\n attachments.length(must be integer)";
          }else{
            a.length = Number(a.length);
          }
        } else {
          valid = false;
          errArray[row.id] = errArray[row.id] + "\n attachments.length(required)";
        }

        if (att.sha2.selected) {
          a["sha2"] = combineStringParts(
            att.sha2.stringParts,
            rowData[row.id]
          );
          if (att.sha2.generateSHA2) {
            a.sha2 = sha256(a.sha2);
          }
          if (!sha2Regex.test(a.sha2)) {
            valid = false;
            errArray[row.id] = errArray[row.id] + "\n attachments.sha2";
          }
        } else {
          valid = false;
          errArray[row.id] = errArray[row.id] + "\n attachments.sha2(required)";
        }

        if (att.fileUrl.selected) {
          a["fileUrl"] = combineStringParts(
            att.fileUrl.stringParts,
            rowData[row.id]
          );
          if (!websiteRegex.test(a.fileUrl)) {
            valid = false;
            errArray[row.id] = errArray[row.id] + "\n attachments.fileUrl";
          }
        }

        json.attachments.push(a);


      });

    }
      /////////////////////////////////////////////////////////////////////////////////////////////////////

      newXapi.push(json);

      if (valid) {
        newChecker.push(true);
      } else {
        newChecker.push(false);
        setAllValid(false);
      }
    });

    setXapi(newXapi);
    alert(xapi);

    setChecker(newChecker);
    //setAllValid(true);

    setErrors(errArray);

    handleUploadCSV();
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleApply}>
        Apply
      </Button>
    </>
  );
};

export default ApplyButton;
