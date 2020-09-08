$(document).ready(function(){
  
  //Ask for short url
  $("#submit").click(function(){

    //Construct request
    let request = `/generate?url=${$("#url").val()}`

    //Axios request to backend server
    axios(request).then(function(response){

      //Display result on webpage
      $("#result").html('url.shrt/'+response.data.url)
    })


  })
})