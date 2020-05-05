$(document).ready(function(){

    let couleur =["#ff3300","#ff6600","#ffcc00","#336699","#000066","#3399ff"]
            $("body").on('click',"#signUp",function(){
        
                    $.ajax({
                        url : "SignUp.php",
                        method : "POST",
                        dataType: "text",
                        success:function(data){
                        console.log(data);
                        $("body").html(data);
                        },
                        complete:function(data){
                            console.log(data);
                         /*iterer sur les div color et detecter l'evenement de click*/
                         $('body #colorSelectorG').each(function(index){
                            
                            $(this).on('click','.color',function(index){
                                $('#colorSelectorG .color[data-color]').each(function(){
                                    $(this).css(
                                    
                                        {
                                            'background-color':$(this).attr('data-color'),
                                        }
                                    );
                                });
                                
                                $(this).attr('data-color',$(this).css("background-color")); 

                                $(this).css({
                                    'background-color':'#181818',
                                  });
                                  let coulGChoisi = $(this).attr('data-color');
                                  $('#colorG').val(coulGChoisi);
                          });
                          
                          


                });

                $('body #colorSelectorM').each(function(index){
                            
                    $(this).on('click','.color',function(index){
                        $('#colorSelectorM .color[data-color]').each(function(){
                            $(this).css(
                            
                                {
                                    'background-color':$(this).attr('data-color'),
                                }
                            );
                        });
                        
                        $(this).attr('data-color',$(this).css("background-color")); 

                        $(this).css({
                            'background-color':'#181818',
                          });

                          let coulMChoisi = $(this).attr('data-color');
                          $('#colorM').val(coulMChoisi);

                  });
                
                


        });

                        },
                        error: function(data){
                            console.log("error");
                                console.log(data);
                        }
                        
                });
        
                });

     var pseudoExistant = document.getElementsByName("erreur")[0].value;
        console.log(pseudoExistant);
        if(pseudoExistant== "true"){
        console.log(pseudoExistant);
            alert("Ce pseudo existe déjà veuillez réessayer avec un nouveau pseudo");
        }

        var ErreurMdp = document.getElementsByName("erreur")[1].value;
        console.log(ErreurMdp);
        if(ErreurMdp== "true"){
        console.log(ErreurMdp);
            alert("le mot de passe ou le pseudo est incorrect veuillez réessayer");
        }

       
                 
});