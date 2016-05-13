if (!window.WAYLAY) {
  WAYLAY = {
    pushParamValue: function(parameter, value, resource, onSuccess, onError) {
      $.ajax({
        type: "POST",
        crossDomain: true,
        url: "https://data.waylay.io/resources/" + resource,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({parameter: value}),
        dataType: "json",
        success: function(data) {
          console.log(data.message);
          if(onSuccess){
            onSuccess(data.message);
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log(jqXHR);
          if(onError) {
            onError(jqXHR.responseText);
          }
        }
      });
    },
    pushData: function(data, resource, onSuccess, onError) {
      //overwrite resource in case it comes from data
      if(data.resource !== undefined)
        resource = data.resource;
      $.ajax({
        type: "POST",
        crossDomain: true,
        url: "https://data.waylay.io/resources/" + resource,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        data: JSON.stringify(data),
        dataType: "json",
        success: function(data) {
          console.log(data.message);
          if(onSuccess){
            onSuccess(data.message);
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log(jqXHR);
          if(onError) {
            onError(jqXHR.responseText);
          }
        }
      });
    },
    getData: function(resource, callback, onError) {
      $.ajax({
        type: "GET",
        crossDomain: true,
        url: "https://data.waylay.io/resources/" + resource +"/current",
        success: function(data) {
          callback(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log(jqXHR);
          if(onError) {
            onError(jqXHR.responseText);
          }
        }
      });
    },
    createAlarm: function(domain, user, pass, template, onSuccess, onError) {
      $.ajax({
        type: "POST",
        crossDomain: true,
        url: "https://" + domain +"/api/tasks/",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "Authorization": "Basic " + btoa(user + ":" + pass)
        },
        data: JSON.stringify(template),
        dataType: "json",
        success: function(data) {
          console.log(data);
          if(onSuccess){
            onSuccess("created task: " +data.ID);
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log(jqXHR);
          if(onError) {
            onError("Error creating a task, check settings");
          }
        }
      });
    },
    pushDomainParamValue: function(domain, user, pass, parameter, value, resource, onSuccess, onError) {
      $.ajax({
        type: "POST",
        crossDomain: true,
        url: "https://data.waylay.io/resources/" + resource + "?domain=" + domain,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "Authorization": "Basic " + btoa(user + ":" + pass)
        },
        data: JSON.stringify({parameter: value}),
        dataType: "json",
        success: function(data) {
          console.log(data.message);
          if(onSuccess){
            onSuccess(data.message);
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log(jqXHR);
          if(onError) {
            onError(jqXHR.responseText);
          }
        }
      });
    },
    pushDomainData: function(domain, user, pass, data, resource, onSuccess, onError) {
      //overwrite resource in case it comes from data
      if(data.resource !== undefined)
        resource = data.resource;
      $.ajax({
        type: "POST",
        crossDomain: true,
        url: "https://data.waylay.io/resources/" + resource + "?domain=" + domain,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "Authorization": "Basic " + btoa(user + ":" + pass)
        },
        data: JSON.stringify(data),
        dataType: "json",
        success: function(data) {
          console.log(data.message);
          if(onSuccess){
            onSuccess(data.message);
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log(jqXHR);
          if(onError) {
            onError(jqXHR.responseText);
          }
        }
      });
    }
  }
}
