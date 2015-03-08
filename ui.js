$(document).ready(function() {
    $("#createKeyFrame").click(function(){
        $(".frame").each(function(){
            if($(this).hasClass("selected")){
                $(this).addClass("keyframe");
            }
        });
        //selected frame is now new keyframe
        axis.frame = $(".selected").attr("id");
        //create that frame (redraw, set frame to selected frame)
        pop.population.forEach(function(element) {
            axis.createNewKeyframe(element);
            axis.clear(element);
            axis.create(element, axis.frame);
        });
    });

    $createFrame = $("#createFrame");
    var frameClick = function(){
        $(".frame").each(function(){
            $(this).removeClass("selected");
        });
        $(this).addClass("selected");
        axis.frame = $(this).attr("id");
        //TODO: code for redrawing the canvas based on the frame
        axis.frame = $(".selected").attr("id");
        pop.population.forEach(function(element) {
            //console.log(axis.getLocation(element.frames, axis.frame));
            axis.clear(element);
            axis.create(element, axis.frame);
        });
    };
    $(".frame").click(frameClick);

    var frameNum = 1;

    //button click -> create frame and add click listener
    $createFrame.click(function(){
        $('#frame_list tr').append('<td><div class="frame"></div></td>');
        $('#frame_list tr td:last .frame').click(frameClick);
        //add an id that increments for each div
        $('#frame_list tr td:last .frame').attr("id", frameNum);
        //axis.lastFrame = frameNum;
        frameNum++;
    });

    for(var i = 0; i < 10; i++){
        $createFrame.click();
    }

    var selectClick = function(){
        axis.select(pop.population[$(this).attr("id").charAt(6)-1], pop.population);
    };
    $("#createPerson").click(function(){
         var newStickman = pop.addStickman();
         pop.population.push(newStickman);
         axis.create(newStickman, axis.frame);
         axis.select(pop.population[pop.population.length - 1], pop.population);
         $("#element_list ul").append("<li>Dude "+pop.population.length+"</li>");
         $("#element_list ul li:last").attr("id","person"+pop.population.length);
         $("#element_list ul li:last").click(selectClick);
         $("#table_list").append("<table id='frame_list'><tr></tr></table>");
         $("#table_list table:last").attr("id", $("#table_list table:last").attr("id")+ " " + pop.population.length);
         $("#table_list table:last tr").append("<td class='frame keyframe' id ='0'></td>");
         for (var i = 1; i < $('#frame_list tr td').length; i++){
            $("#table_list table:last tr").append("<td class='frame' id = '" + i + "'></td>");
         }
     });
     $("li").click(selectClick);

    $("#animate").click(function(){
        axis.animate(frameNum-1);
    });
});
