/*!
 * Start Bootstrap - Freelancer Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('body').on('click', '.page-scroll a', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});

// Floating label headings for the contact form
$(function() {
    $("body").on("input propertychange", ".floating-label-form-group", function(e) {
        $(this).toggleClass("floating-label-form-group-with-value", !! $(e.target).val());
    }).on("focus", ".floating-label-form-group", function() {
        $(this).addClass("floating-label-form-group-with-focus");
    }).on("blur", ".floating-label-form-group", function() {
        $(this).removeClass("floating-label-form-group-with-focus");
    });
});


var enableSimulation = function(){
    $("#stopSimulation").prop('disabled', false);
    $("#startSimulation").prop('disabled', true);
    //$("#measurementPanel").fadeOut(1000);
    //$("#settingsPanel").fadeOut(1000);
    //$("#simulationSettings").fadeOut(1000);
};

var disableSimulation = function(){
    $("#stopSimulation").prop('disabled', true);
    $("#startSimulation").prop('disabled', false);
    //$("#measurementPanel").fadeIn(1000);
    //$("#settingsPanel").fadeIn(1000);
    //$("#simulationSettings").fadeIn(1000);
};

var randomColorGeneator = function () { 
    return '#' + (Math.random().toString(16) + '0000000').slice(2, 8); 
};

var changeSettings = function(){
    var resource = $('#resource').val();      
    var enpointhtml='<p id="endpoint">URL: https://data.waylay.io/resources/'+resource+"/current";
    if(domain && domain !== ""){
        enpointhtml += "?domain=" +domain;
        var key = $('#key').val();
        var password = $('#secret').val();
        var header = "Header:" + '<span style="font-size: 10px;">Authorization Basic ' + btoa(key + ":" + password) + "</span>";
        var headerhtml = '<p id="headerendpoint">'+ header + "</p>"
        $('#headerendpoint').replaceWith(headerhtml);
    }
    enpointhtml += "</p>";
    $('#endpoint').replaceWith(enpointhtml);
};

$('#myChartPanel').mutate('height', function(e) {
   $('#myChart')
     .css('width', ($(window).width()/2) +'px')
     .css('height', '400px');
   var c = document.getElementById("myChart");
   c.height = "400";
   c.width = ($(window).width()/2);
});

var simulationData =[];
var timerId = 0;
var chartData = {};
var myLineChart;
var ctx;
var domain ="";
var key = "";
var password = "";
var selectionStats = {};

$(document).ready(function(){
  $('[data-toggle="tooltip"]').tooltip();
  $("#simulation").hide();
  $('#myChart')
    .css('width', ($(window).width()/2) +'px')
    .css('height', '400px');
  $('#myChartPanel').hide();

  changeSettings();

  var clearMessages = function(){
    $("#error").text("");
    $("#info").text("");
  };

  var errorHandler = function(error){
    $("#error").text(error);
  };

  var successHandler = function(info){
    $("#info").text(info);
  };
  var errorHandlerAlert = function(error){
     BootstrapDialog.show({
        type: BootstrapDialog.TYPE_DANGER,
        title: 'Error, please check login settings',
        message: error,
        buttons :[{
                label: 'Close',
                action: function(dialogItself){
                    dialogItself.close();
                }}]
    });     
  };

  var successHandlerAlert = function(info){
    BootstrapDialog.alert(info);
    //$("#notification").fadeOut();
  };

  $("#debug").click(function(e){
    clearMessages();
    e.preventDefault();
    BootstrapDialog.alert(JSON.stringify(createTemplate()));
    });
  
  $("#addSelection").click(function(e){
    clearMessages();
    e.preventDefault();

  });
  
  $("#pushDomain").click(function(e){
    clearMessages();
    e.preventDefault();
    var resource = $('#resource').val();
    try {
      var data = JSON.parse($('#data').val());
      if (domain) {
        WAYLAY.pushDomainData(domain, key, password, data, resource, successHandler, errorHandler);
      } else {
        WAYLAY.pushData(data, resource, successHandler, errorHandler);
      }
    }catch(e){
      errorHandler(e.message);
    }
  });

  var THR = {
    "Compressor hours" : 1000,
    "Revolutions per minute (rpm)" : 2000,
    "Condensing temperature" : 70,
    "Evaporating temperature" : 35
  };

  $("#selection").change(function() {
      var $this = $(this),
      value = $this.val();
      var toSend = {};
      toSend[value] = ( THR[value] || 100  ) + 1;
      $('#data').text(JSON.stringify(toSend));
      $('#threshold').val(THR[value] || 100);
  });

  $("#login").click(function(e){
    clearMessages();
    e.preventDefault();
    BootstrapDialog.show({
        title: 'Input parameters',
        message: function (dialogItself) {
            var $form = $('<div><input style="margin-bottom: 5px;" placeholder="Domain:" type="text" id="domain" value="app.waylay.io" name="domain" class="form-control form-control-centered"></div><div> <input style="margin-bottom: 5px;" placeholder="API key:" type="password" value="" id="key" name="key" class="form-control form-control-centered"/></div><div><input style="margin-bottom: 5px;" type="password" placeholder="API secret:" value="" id="secret" name="secret" class="form-control form-control-centered"/></div></div>');
            return $form;
        },
        buttons :[{
                label: 'Close',
                action: function(dialogItself){
                    domain = $('#domain').val();
                    key = $('#key').val();
                    password = $('#secret').val();
                    dialogItself.close();
                }}]
    }); 
  });

  var createTemplate = function() {
    var resource = $('#resource').val();
    var parameter = $( "#selection option:selected" ).text();
    //var parameter = $('#parameter').val();
    var threshold = $('#threshold').val();
    var thresholdCrossing = $('#thresholdCrossing').val();
    var to = $('#to').val();
    var subject = $('#subject').val();
    var message = $('#message').val();
    var weekendSelection = $('#weekendSelection').is(":checked");
    var weekSelection = $('#weekSelection').is(":checked");
    var relationStates = [];
    if(weekendSelection)
        relationStates.push(["TRUE", thresholdCrossing]);
    if(weekSelection)
        relationStates.push(["FALSE", thresholdCrossing]);
    return {
        sensors: [{
            label: "data",
            name: "streamingDataSensor",
            version: "1.1.3",
            resource: "$",
            position: [245, 205],
            properties: {
               parameter: parameter,
               threshold: threshold
            }
        },
        {
            label: "isWeekend",
            name: "isWeekend",
            version: "1.0.3",
            resource: resource,
            position: [245, 405],
            properties: {
               timeZone: "Europe/Brussels"
            }
        }],
        actuators : [{
            label: "Mail",
            name: "templateMail",
            version: "0.0.8",
            position: [492, 156],
            properties: {
               from: "support@waylay.io",
               to: to,
               subject: subject,
               message: message
            }
        }],
        relations :[{
              label: "Gate",
              type: "GENERAL",
              position: [481, 313],
              parentLabels: ["isWeekend", "data"],
              combinations: relationStates
            }],
        triggers : [{
            destinationLabel: "Mail",
            invocationPolicy: 1,
            sourceLabel: "Gate",
            statesTrigger: ["TRUE"]
        }],
        task : {
            name: "Create alarm task for machine "+ resource,
            type : "reactive",
            resource: resource,
            start : true
        }
    }
  };
  $("#createAlert").click(function(e){
    clearMessages();
    e.preventDefault();
    try {
      template = createTemplate();
      WAYLAY.createAlarm(domain, key, password, template, successHandlerAlert, errorHandlerAlert);
    }catch(e){
      errorHandler(e.message);
    }
  });

  $('#toggleHeader').click(function(e) {
    e.preventDefault();
    $('.toggleHeader').slideToggle('fast');
    return false;
  });


    $("#domain" ).change(function() {
        changeSettings();
    });
    $("#resource" ).change(function() {
        changeSettings();
    });
    $("#key" ).change(function() {
        changeSettings();
    });
    $("#secret" ).change(function() {
        changeSettings();
    });
    
    $("#startSimulation").click(function(e){
          e.preventDefault();
          $('#myChartPanel').show();
          var resource = $('#resource').val();
          var frequency = $('#frequency').val();
          var countToStop = parseInt($('#countToStop').val());
          var count = 0;
          if(myLineChart && myLineChart.datasets && myLineChart.datasets.length > 0){
            while(myLineChart.datasets[0].points.length > 0)
                myLineChart.removeData();
          }
          //chartData["labels"] = [1, 2, 3, 4, 5, 6, 7];
          if(key && password && domain){
            if(frequency && simulationData.length > 0){
                timerId = setInterval(function(){ 
                    enableSimulation();
                    count++;
                    if(simulationData.length === 0 || count > countToStop){
                        disableSimulation();
                        clearInterval(timerId);
                    }             
                    else{
                        if(count > simulationData.length - 1)
                            count = 0;
                        WAYLAY.pushDomainData(domain, key, password, simulationData[count], resource); 
                        var point = simulationData[count];
                        var date = new Date();
                        myLineChart.addData(_.values(point),date.getHours() + ":" + date.getMinutes() +":" +date.getSeconds());
                        if(count > 20)
                            myLineChart.removeData();
                    }
                        
                }, frequency);
            }
          } else {
            if(frequency && simulationData.length > 0){
                timerId = setInterval(function(){ 
                    enableSimulation();
                    count++;
                    if(simulationData.length === 0 || count > countToStop){
                        disableSimulation();
                        clearInterval(timerId);
                    } 
                    else {
                        if(count > simulationData.length - 1)
                            count = 0;
                        WAYLAY.pushData(simulationData[count], resource);
                        var point = simulationData[count];
                        var date = new Date();
                        myLineChart.addData(_.values(point), date.getHours() + ":" + date.getMinutes() + ":" +date.getSeconds());
                        if(count > 20)
                            myLineChart.removeData();

                    }
                    }, frequency*1000);
            }
          }  
    });
    $("#stopSimulation").click(function(e){
        e.preventDefault();
        clearInterval(timerId);
        disableSimulation();
        $('#myChartPanel').hide();
    });

    $("#filename_csv").change(function(e) {
        var ext = $("input#filename_csv").val().split(".").pop().toLowerCase();
        if($.inArray(ext, ["csv"]) == -1) {
            alert('Not a CSV file');
            return false;
        }

        if (e.target.files != undefined) {
            var reader = new FileReader();
            reader.onload = function(e) {
                simulationData = [];
                var html = '<div id="datatable"> <table class="table table-striped table-bordered table-condensed" style="width:100%;">';

                var rows = e.target.result.split("\n");
                var params = rows[0].split(",");
                chartData = {labels : [], datasets:[]};
                var k =0;
                params.forEach(function(param){
                    chartData["datasets"][k++] = {
                        label: param, 
                        data:[],
                        fillColor: "rgba(230,220,220,0.1)",
                        strokeColor: randomColorGeneator(), 
                        highlightFill: randomColorGeneator(),
                        highlightStroke: randomColorGeneator()
                    };
                });
                $('#myChartPanel').show();
                ctx = $("#myChart").get(0).getContext("2d");
                myLineChart = new Chart(ctx).Line(chartData);
                var count = 0;
                rows.forEach(function(row) {
                    var columns = row.split(",");
                    if(count > 0){
                        var measurement = {};
                        columns.forEach(function (col, index){
                            if(isNaN(col))
                                measurement[params[index].trim()] = col;
                            else
                                measurement[params[index].trim()] = parseFloat(col).toPrecision(3);
                        });
                        simulationData.push(measurement);
                    }
                    html += "<tr>";
                    columns.forEach(function (col){
                        if(count > 3)
                            return;
                        if(count === 0)
                            html += '<th style="text-align: center;">' + col.trim() + "</th>";
                        else
                            html += "<td>" + parseFloat(col.trim()).toPrecision(3) + "</td>";
                    });
                    count++;
                    html += "</tr>";
                });
                html += "</table></div>";
                $('#datatable').replaceWith(html);

                var settingsHTML = '<div id="settings"><label for="frequency">Simulation frequency [ms]</label><input style="width: 80%;margin-left: 40px;margin-bottom: 5px;" class="form-control" type="number" id="frequency" name="frequency" value="1000"/></div>';
                $('#settings').replaceWith(settingsHTML);

                var countHTML = '<div id="count"><label for="countToStop">Number of records</label><input style="width: 80%;margin-left: 40px;margin-bottom: 5px;" class="form-control" type="number" id="countToStop" name="countToStop" value="' + (rows.length - 1)+'"/></div>';
                $('#count').replaceWith(countHTML);

                $("#simulation").show();
                $("#myChart").show();
            };
            reader.readAsText(e.target.files.item(0));
        }
        return false;
    });

    
    $(window).scroll(function(){
        if ($(this).scrollTop() > 100) {
            $('.scrollup').fadeIn();
        } else {
            $('.scrollup').fadeOut();
        }
    }); 

    $('.scrollup').click(function(){
        $("html, body").animate({ scrollTop: 0 }, 600);
        return false;
    });
    
    // Highlight the top nav as scrolling occurs
    $('body').scrollspy({
        target: '.navbar-fixed-top'
    })

    // Closes the Responsive Menu on Menu Item Click
    $('.navbar-collapse ul li a').click(function() {
        $('.navbar-toggle:visible').click();
    });

    $(".optionName").popover({ trigger: "hover" });


});


$('#filename_csv').bind('change', function () {
  var filename = $("#filename_csv").val();
  if (/^\s*$/.test(filename)) {
    $(".file-upload").removeClass('active');
    $("#noFile").text("No file chosen..."); 
  }
  else {
    $(".file-upload").addClass('active');
    $("#noFile").text(filename.replace("C:\\fakepath\\", "")); 
  }
});





// $(document).on('change', '.btn-file :file', function() {
//   var input = $(this),
//       numFiles = input.get(0).files ? input.get(0).files.length : 1,
//       label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
//   input.trigger('fileselect', [numFiles, label]);
// });

// $(document).ready( function() {
//     $('.btn-file :file').on('fileselect', function(event, numFiles, label) {
        
//         var input = $(this).parents('.input-group').find(':text'),
//             log = numFiles > 1 ? numFiles + ' files selected' : label;
        
//         if( input.length ) {
//             input.val(log);
//         } else {
//             if( log ) alert(log);
//         }
        
//     });
// });
