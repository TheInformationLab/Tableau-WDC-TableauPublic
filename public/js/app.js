(function () {
  // Create the connector object
  var myConnector = tableau.makeConnector();

  function convertDate(d) {
    var s = new Date(d).toLocaleDateString().replace(/\//g, "-");
    return s;
  }

  // Define the schema
  myConnector.getSchema = function (schemaCallback) {
    var tableSchema = {
      id: "TableauPublic",
      alias: "Tableau Public API",
      columns: cols,
    };

    schemaCallback([tableSchema]);
  };

  // Grab data from server /data
  myConnector.getData = function (table, doneCallback) {
    // var url = "http://localhost:3001" + "/data";
    var deployedUrl = "https://tableau-public-api.wdc.dev/api";
    var sendUsername = tableau.connectionData.replace(/\s/g, "");

    $.getJSON(deployedUrl, {
      data: sendUsername,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
    }).done(function (resp) {
      var tableData = [];
      console.log("Logging the response", resp);

      console.log(resp[0].firstPublishDate);
      console.log(convertDate(resp[0].firstPublishDate));

      for (var i = 0, len = resp.length; i < len; i++) {
        tableData.push({
          title: resp[i].title,
          category: resp[i].category,
          authorProfileName: resp[i].authorProfileName,
          ownerId: resp[i].ownerId,
          workbookRepoUrl: resp[i].workbookRepoUrl,
          numberOfFavorites: resp[i].numberOfFavorites,
          firstPublishDate: convertDate(resp[i].firstPublishDate),
          lastPublishDate: convertDate(resp[i].lastPublishDate),
          lastUpdateDate: convertDate(resp[i].lastUpdateDate),
          permalink: resp[i].permalink,
          viewCount: resp[i].viewCount,
          showTabs: resp[i].showTabs,
          showToolbar: resp[i].showToolbar,
          showByline: resp[i].showByline,
          warnDataAccess: resp[i].warnDataAccess,
          showShareOptions: resp[i].showShareOptions,
          showWatermark: resp[i].showWatermark,
          allowDataAccess: resp[i].allowDataAccess,
          defaultViewName: resp[i].defaultViewName,
          size: resp[i].size,
          revision: resp[i].revision,
          extractInfo: resp[i].extractInfo,
          defaultViewRepoUrl: resp[i].defaultViewRepoUrl,
          description: resp[i].description,
          attributionsauthorProfileName: resp[i].attributionsauthorProfileName,
          attributionsattributionUrl: resp[i].attributionsattributionUrl,
          attributionsworkbookRepoUrl: resp[i].attributionsworkbookRepoUrl,
          attributionsauthorDisplayName: resp[i].attributionsauthorDisplayName,
          attributionsworkbookName: resp[i].attributionsworkbookName,
          attributionsworkbookViewName: resp[i].attributionsworkbookViewName,
        });
      }
      table.appendRows(tableData);
      doneCallback();
    });
  };

  tableau.registerConnector(myConnector);

  // Create event listeners for when the user submits the form
  $(document).ready(function () {
    $("#submitButton").click(function () {
      var userName = $("#tableauUsername").val();
      if (userName !== "") {
        tableau.connectionName = "Tableau Public API"; // This will be the data source name in Tableau
        tableau.connectionData = $("#tableauUsername").val(); // The Username in Tableau Public
        tableau.submit(); // This sends the connector object to Tableau
      } else {
        document.getElementById("error").innerHTML = "Please enter a username";
        tableau.log("No username entered..");
      }
    });
  });
})();
