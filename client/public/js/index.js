var context, name, inputText = '', micClickCounter = 0, micAvailable = 0;
var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
var numbers = /[0-9]{10}/;
var letters = /^[A-Za-z]+$/;
var status = "less";


$(document).ready(function () {
    $('#loader').hide();
    $('#myInput').attr("disabled", false);
    welcomeMessage();
});

var wage = document.getElementById("myInput");
wage.addEventListener("keydown", function (e) {
    if (e.keyCode === 13) {  //checks whether the pressed key is "Enter"
        var value1 = $('#myInput').val();
        if (value1)
            update(value1);
    }
});


function welcomeMessage() {
    $.ajax({
        url: '/api/welcomeMessage',
        type: 'GET',
        success: renderMessage
    });
}

function renderMessage(data) {

    for (i = 0; i < data.length; i++) {

        if (data[i]['message'] === 'text') {
            renderText(data[i]['text']['text'])
        } else if (data[i]['message'] === 'payload') {
            renderCustomMessage(data[i]['payload'])
        }

    }
    $('#loader').hide();
    $(".chat-outer-wrapper").animate({ scrollTop: $('.chat-outer-wrapper').prop("scrollHeight") }, 1000);

}

function renderText(data) {
    context = data
    var text = '';
    text = text + '<div class="row" style="vertical-align:top; display: flex; "><img src="images/UnripeAdored.gif" width="40px" height="40px" style="margin-left:12px;"><div class="rply-msg-box"><span  style="color: #ffff; word-wrap: break-word">' + data + '</span></div></div><br/>';
    $('.chats-content').append(text);
}

function renderCustomMessage(data) {
    console.log('=====data====',data)
    context = data
    if (data['fields']['type']['stringValue'] === 'table') {
        renderTable(data.fields.data.listValue.values)
    } else if (data['fields']['type']['stringValue'] === 'dropdown') {
        renderDropDown(data.fields.data.listValue.values)
    }

}

function renderTable(data) {

    var div = '<div class="table-rply-msg-box"><table><tr><th>ID</th><th>Name</th><th>Manager</th><th>Geography</th><th>Spend (in million USD)</th><th>Revenue (in million USD)</th></tr><tr>'

    for (let i = 0; i < data.length; i++) {
        let objectKeys = Object.keys(data[i].structValue.fields)
        for (let j = 0; j < objectKeys.length; j++) {
            data[i][objectKeys[j]] = data[i].structValue.fields[objectKeys[j]].stringValue || data[i].structValue.fields[objectKeys[j]].numberValue
        }
        const { kind, structValue, _id, ...tableData } = data[i]

        div = div + "<td>" + tableData["supplier_id"] + "</td><td>" + tableData["name"] + "</td><td>"+ tableData["manager_name"] + "</td><td>" + tableData["location"] + "</td><td>" + tableData["spending"] + "</td><td>" + tableData["revenue"] + "</td><td>" + "</td></tr><tr>"
    }

    div = div + '</tr></table></div><br/>'
    $('.chats-content').append(div);
    // $('#myInput').attr("disabled", true);

}

function renderDropDown(data) {

    const supplierList = data.map(function (value) {
        return value.stringValue;
    });

    var div = '<div class="row" style="vertical-align:top; display: flex; "><img src="images/UnripeAdored.gif" width="40px" height="40px" style="margin-left:12px;"><div class="rply-msg-box" >';
    div = div + `
    <form id="user_data">
    <div class="row"><div class="col-sm-9"><label for="i_am"><i class="fa fa-user-o" aria-hidden="true"></i>&nbsp;&nbsp; `+ 'Suppliers' + `</label></div><div class="col-sm-9"><select id="i_am" name="i_am" onchange='roleDetails(this.value);' style="width:95%; border-radius:5px; padding:5px; color:black;">
    <option selected disabled value="default">Select your option</option>`
    supplierList.forEach(element => {
        div = div + '<option value="' + element + '">' + element + '</option>'
    });
    div = div + '</select></div></div><br></form></div></div><br/>'

    $('.chats-content').append(div);
    $('#myInput').attr("disabled", true);

}

function roleDetails(val) {
    context['text'] = val;
    $('.chats-content').append('<div class="row"><div class="sent-msg-box" ><p style="color: #ffff; word-wrap: break-word">' + val + '</p></div></div><br/>');
    $(".chat-outer-wrapper").animate({ scrollTop: $('.chat-outer-wrapper').prop("scrollHeight") }, 100);
    $('#loader').show();

    $.ajax({
        url: '/api/chatService/',
        type: 'POST',
        dataType: "json",
        data: {
            data: context['text']
        },
        success: renderMessage
    });
}

function update(text) {
    $('.chat-btns').attr("disabled", true);
    $('.chat-btns').removeClass("chat_btns_hover")
    context['text'] = text;
    inputText = '';
    document.getElementById('myInput').value = '';

    if (text == 'acknowledge opening form') {
        $('.chats-content').append('<div class="row"><div class="sent-msg-box" "><p style="color: #ffff; word-wrap: break-word">' + 'Submit' + '</p></div></div><br/>');
    }
    else {
        $('.chats-content').append('<div class="row"><div class="sent-msg-box" "><p style="color: #ffff; word-wrap: break-word">' + text + '</p></div></div><br/>');
    }

    $(".chat-outer-wrapper").animate({ scrollTop: $('.chat-outer-wrapper').prop("scrollHeight") }, 100);
    $('#loader').show();
    $.ajax({
        url: '/api/chatService/',
        type: 'POST',
        dataType: "json",
        data: {
            data: context['text']
        },
        success: renderMessage
    });
}