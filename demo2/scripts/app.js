var statics = {
    sites: [
        "LL1N015752",
        "LL1N015750"
    ]
};
window.Model = {
    tasks: null,
    templates: null,
    selectedSite: null,
    selectedTemplate: null
};

$(function () {
    $("#formConnect").hide();
    $("#app").hide();

    if (localStorage.auth)
        WAYLAY.authdata = JSON.parse(localStorage.auth);

    changeView();
    onSelectTemplate(null);
    $('#btnFormConnect').click(function () {
        WAYLAY.authdata = {
            url: $('#txtUrl').val(),
            apikey: $('#txtApiKey').val(),
            apisecret: $('#txtApiSecret').val()
        };
        changeView();
    });

    $('#btnLogout').click(function () {
        localStorage.setItem('auth', null);
        WAYLAY.authdata = null;
        changeView();
    });
});

function changeView() {
    if (WAYLAY.authdata) {
        WAYLAY.getAllTemplates(function (data) {
            $('#formConnect').hide();
            $('#app').show();
            changeSites();
            localStorage.setItem('auth', JSON.stringify(WAYLAY.authdata));
            Model.templates = data;
            loadTasks();
        }, function () {
            WAYLAY.authdata = null;
            changeView();
        });
    } else {
        $('#formConnect').show();
        $('#app').hide();
    }
}

function changeSites() {
    var el = $('#sites').find('ul.list-group');
    if (!Model.selectedSite) {
        el.html('');
        _.each(statics.sites, function (site) {
            var li = $('<li class="list-group-item"><a href="#">' + site + '</a></li>');
            li.find('a').click(function (e) {
                e.preventDefault();
                el.find('li').each(function (i, element) {
                    $(element).removeClass('active');
                });
                $(this).parent().addClass('active');
                Model.selectedSite = site;
                onChangeSite(site);
                onSelectTemplate(null);
            });
            el.append(li);
        });
    }
}

function onChangeSite(site) {
    var el = $('#templates').find('ul.list-group');
    Model.selectedTemplate = null;
    el.empty();
    _.each(Model.templates, function (template) {
        var li = $('<li class="list-group-item"><a href="#">' + template.name + '</a></li>');
        li.find('a').click(function (e) {
            e.preventDefault();
            el.find('li').each(function (i, element) {
                $(element).removeClass('active');
            });
            $(this).parent().addClass('active');
            Model.selectedTemplate = template;
            onSelectTemplate(template);
        });
        el.append(li);
    });
}

function onSelectTemplate(template) {
    $('#txtName').val('');
    if (!template)
        $('#tasks').hide();
    else {
        $('#tasks').show();
        $('#txtName').focus();
        $('#createTask').off();
        $('#createTask').click(function (ev) {
            var name = $('#txtName').val();
            console.log(name);
            if (name) {
                WAYLAY.createTask(name, Model.selectedSite, Model.selectedTemplate.name, '0/15 * * * * ?', true, function () {
                    loadTasks();
                    onSelectTemplate(null);
                    Model.selectedSite = null;
                    onChangeSite(null);

                });
            }
        });
    }
}

function loadTasks() {
    WAYLAY.getTasks(50, function (success) {
        Model.tasks = success;
        showTasks();
    });
}

function showTasks() {
    var table = $('#table_tasks');
    table.empty();
    table.append($('<tr><th>ID</th><th>Name</th><th>Site</th><th>Template</th><th>Created at</th></tr>'));
    _.each(Model.tasks, function (task) {
        var row = $('<tr>');
        row.append('<td>' + task.ID + '</td>');
        row.append('<td>' + task.name + '</td>');
        row.append('<td>' + task.resource + '</td>');
        row.append('<td>' + task.template + '</td>');
        row.append('<td>' + new Date(task.createTime).toLocaleString() + '</td>');
        table.append(row);
    });
}