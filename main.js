$(document).ready(function(){
    $('body').on('click','.nav-link',function(){
        
        $('.nav-link.active').css({
            'background-color':'transparent',
            'color':'white'
        });

        $('nav-link.active').attr('class','nav-link');

        $(this).css({
                'background-color':'rgb(0, 247, 255)',
                'color':'black' 
        });
    
        $(this).attr('class','nav-link active');
    });

    
}); 