// READ records
function readRecords() {
    $.get("/actors/", {}, function (data, status) {
        data.forEach(function(value) {
            var row = '<tr id="row_id_'+ value.id +'">'
            			+ displayColumns(value)
        				+ '</tr>';
            $('#actors').append(row);
        });
    });
}



function displayColumns(value) {
    return 	'<td>'+value.id+'</td>'
            + '<td class="name">'+value.name+'</td>'
			+ '<td class="age">'+value.age+'</td>'
			+ '<td class="movieplayed">'+value.movieplayed+'</td>'
			+ '<td align="center">'
			+	'<button onclick="viewRecord('+ value.id +')" class="btn btn-edit">Update</button>'
			+ '</td>'
			+ '<td align="center">'
			+	'<button onclick="deleteRecord('+ value.id +')" class="btn btn-danger">Exclude</button>'
			+ '</td>';
}

function addRecord() {
    $('#id').val('');
    $('#name').val('');
    $('#age').val('');
    $('#movieplayed').val('');
  
    
    $('#myModalLabel').html('Add');
    $('#add_new_record_modal').modal('show');
}

function viewRecord(id) {
    var url = "/actors/" + id;
    
    $.get(url, {}, function (data, status) {
        //bind the values to the form fields
        $('#name').val(data.name);
        $('#age').val(data.year);
        $('#movieplayed').val(data.genre);
        
        $('#id').val(id);
        $('#myModalLabel').html('Edit Actor');
        
        $('#add_new_record_modal').modal('show');
    });
}
function saveRecord() {
    var formData = $('#record_form').serializeObject();
    if(formData.id) {
        updateRecord(formData);
    } else {
        createRecord(formData);
    }
}

function createRecord(formData) {
    $.ajax({
        url: '/actors/',
        type: 'POST',
        accepts: {
            json: 'application/json'
        },
        data: formData,
        success: function(data) {
            $('#add_new_record_modal').modal('hide');
            
            var row = '<tr id="row_id_'+ data.id +'">'
            			+ displayColumns(data)
        				+ '</tr>';
            $('#actors').append(row);
        } 
    });
}

function updateRecord(formData) {
    $.ajax({
        url: '/movies/'+formData.id,
        type: 'PUT',
        accepts: {
            json: 'application/json'
        },
        data: formData,
        success: function(data) {
            $('#row_id_'+formData.id+'>td.name').html(formData.name);
            $('#row_id_'+formData.id+'>td.age').html(formData.year);
            $('#row_id_'+formData.id+'>td.movieplayed').html(formData.genre);
            $('#add_new_record_modal').modal('hide');
        } 
    });
}
function deleteRecord(id) {
    $.ajax({
        url: '/actors/'+id,
        type: 'DELETE',
        success: function(data) {
            $('#row_id_'+id).remove();
        }
    });
}

$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};


