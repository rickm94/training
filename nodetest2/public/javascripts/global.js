// Userlist data Array for filling in info box
var userListData = [];

/* -------------- DOM READY -------------- */
$(document).ready(function() {
    // populate the user table on inital load
    populateTable();
    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
    $('#btnAddUser').on('click', addUser);
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
});

function populateTable() {

    // empty content string
    var tableContent = '';

    //jQuery AJAX call for JSON
    $.getJSON('/users/userlist', function(data){
        userListData = data;
        $.each(data,function(){
            tableContent += '<tr>';
            tableContent += '<td> <a href="#" class="linkshowuser" rel="'+ this.username +'" >' + this.username + '</a> </td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td> <a href="#" class="linkdeleteuser" rel="' + this._id + '"> delete </a> </td>';
            tableContent += '</tr>';
        });
        //Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);
    });

}

function showUserInfo(event){

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisUserName = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = userListData.map(function(arrayItem){ return arrayItem.username; }).indexOf(thisUserName);

    // Get User Object
    var thisUserObject = userListData[arrayPosition];

    // Populate Info Box
    $('#userInfoName').text(thisUserObject.fullname);
    $('#userInfoAge').text (thisUserObject.age);
    $('#userInfoGender').text(thisUserObject.gender);
    $('#userInfoLocation').text(thisUserObject.location);
}

function addUser(event){
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addUser input').each(function(index,val){
        if($(this).val() === '') {errorCount++;}
    });

    // Check and make sure errorCount still at 0
    if (errorCount === 0){
        // if it is, compile all user info into one object
        var newUser = {
            'username' : $('#addUser fieldset input#inputUserName').val(),
            'email' : $('#addUser fieldset input#inputUserEmail').val(),
            'fullname' : $('#addUser fieldset input#inputUserFullname').val(),
            'age' : $('#addUser fieldset input#inputUserAge').val(),
            'location' : $('#addUser fieldset input#inputUserLocation').val(),
            'gender' : $('#addUser fieldset input#inputUserGender').val()
        }

        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/users/adduser',
            dataType: 'JSON'
        }).done(function(res){
            // Check for successful  (blank) response
            if(res.msg === ''){
                // Clear the from inputs
                $('#addUser fieldset input').val('');

                // update the table
                populateTable();
            } else {
                // if somehing went wrong
                alert('Error: ' + res.msg);
            }
        })
    } else {
        // if errorCount is more than 0, error out 
        alert('Please fill in all fields');
        return false;
    }

}

/*
* Delete User
*/
function deleteUser(event){

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this user?');

    // check if confirmation box was true
    if (confirmation === true){
        // if they did, do delete
        $.ajax({
            type: 'DELETE',
            url: '/users/deleteuser/' + $(this).attr('rel')
        }).done(function(res){
            // check if successful (blank) res
            if (res.msg === '') {
                // do nothing
            } else {
                alert('Error: ' + res.msg);
            }
            // Update the table
            populateTable();
        });
    } else {
       // if confirmation box was false
       return false; 
    }
};