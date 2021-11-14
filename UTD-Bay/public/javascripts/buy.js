// Data Picker Initialization
$('.datepicker').datepicker();

$(document).ready(function(){
$.getJSON("./data.json", function(data){
data.foreach(element => {
var itemCard = '<div class="card" style="width: 18rem;"><img class="card-img-top" src="'+element.image+'" alt="Card image cap"><div class="card-body"><h5 class="card-title">'+element.name+'</h5><p class="card-text">'+element.price+'</p><p class="card-text">'+element.category+'</p><p class="card-text">'+element.desc+'</p><a href="#" class="btn btn-primary">Buy</a></div> </div>'
$('#items-deck').append(itemCard);
})
})
})