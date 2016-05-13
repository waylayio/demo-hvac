if (!window.WAYLAY) {
    WAYLAY = {
        authdata: null,
        getAllTemplates: function (onSuccess, onError) {
            $.ajax({
                type: 'GET',
                crossDomain: true,
                url: WAYLAY.authdata.url + '/api/templates',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: 'Basic ' + btoa(WAYLAY.authdata.apikey + ":" + WAYLAY.authdata.apisecret)},
                success: function (data) {
                    console.log(data);
                    if (onSuccess)
                        onSuccess(data);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR);
                    if (onError) {
                        onError(jqXHR.responseText);
                    }
                }
            });
        },
        getTasks: function (count, onSuccess, onError) {
            $.ajax({
                type: 'GET',
                crossDomain: true,
                url: WAYLAY.authdata.url + '/api/tasks?hits=' + count,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: 'Basic ' + btoa(WAYLAY.authdata.apikey + ":" + WAYLAY.authdata.apisecret)
                },
                success: function (data) {
                    console.log(data);
                    if (onSuccess)
                        onSuccess(data);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR);
                    if (onError) {
                        onError(jqXHR.responseText);
                    }
                }
            });
        },
        createTask: function (name, resource, template, cron, start, onSuccess, onError) {
            $.ajax({
                type: 'POST',
                crossDomain: true,
                url: WAYLAY.authdata.url + '/api/tasks',
                data: JSON.stringify({
                    name: name,
                    resource: resource,
                    template: template,
                    cron: cron,
                    type: 'scheduled',
                    start: start
                }),
                dataType: 'json',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: 'Basic ' + btoa(WAYLAY.authdata.apikey + ":" + WAYLAY.authdata.apisecret)
                },
                success: function (data) {
                    console.log(data);
                    if (onSuccess)
                        onSuccess(data);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR);
                    if (onError) {
                        onError(jqXHR.responseText);
                    }
                }
            });
        }
    }
}