//PennController.DebugOff()       //Activate this line before publishing the experiment to turn off the debugger

//PennController.ResetPrefix()

PennController.ResetPrefix(null); // Shorten command names (keep this line here))

// DebugOff()   // Uncomment this line only when you are 100% done designing your experiment

// Define the sequence of elements. First show 1instructions, then experiment trials, send results and show end screen
Sequence("consent","instrucciones", "experimento", (rshuffle("items_experimentales","fillers")),SendResults(), "end"),

// This is run at the beginning of each trial
Header(
    // Declare a global Var element "ID" in which we will store the participant's ID
    newVar("ID").global()    
)
.log( "id" , getVar("ID") ), // Add the ID to all trials' results lines

// Instructions
newTrial("consent",
    newHtml("consent_form", "example_intro.html")
        .cssContainer({"width":"720px"})
        .checkboxWarning("You must consent before continuing.")
        .print()
        ,
    newButton("continue", "Pulsa aquí para continuar")
        .center()
        .print()
        .wait(getHtml("consent_form").test.complete()
                  .failure(getHtml("consent_form").warn())
        )
    )
    ,

newTrial("instrucciones",
     // Automatically print all Text elements, centered
    defaultText.center().print()
            .css("font-size", "18pt")
    ,
    newText("Hola!")
    ,
    newText("En esta tarea, leerás algunas frases.")
    ,
    newText("¿Estás preparada/o?")
        .cssContainer({"margin-bottom":"2em"})  // this line adds space between the sentence and the scale
    ,
    newText("Por favor, escribe tu nombre en el recuadro y después presiona el botón para comenzar con la tarea.")
    ,
    newTextInput("inputID", "")
        .center()
        .css("margin","1em")    // Add a 1em margin around this element
        .print()
    ,
    newButton("Comenzar")
        .css("font-size", "18pt")
        .center()
        .print()
        // Only validate a click on Start when inputID has been filled
        .wait( getTextInput("inputID").testNot.text("") )
    ,
    // Store the text from inputID into the Var element
    getVar("ID").set( getTextInput("inputID") )
),

// First experiment trial
newTrial( "experimento",
    newText("instrucciones", "Presiona el botón para comenzar a leer. Presiona la barra espaciadora para continuar a la siguiene palabra.")
        .css("font-size", "18pt")
        .print()
    ,
    newButton("Comenzar a leer")
        .center()
        .css("font-size", "18pt")
        .print()
        .wait()
        .remove()
    ,
    getText("instrucciones")
        .remove()
    ),


    
    
Template(PennController.GetTable("experimental.csv"),
    exp =>  newTrial("items_experimentales",
            newText("sep", "*")
                .css("font-size", "18pt")
                .center()
                .print()
            ,
            newTimer("wait", 500)
                .start()
                .wait()
            ,
                getText("sep")
                .remove()
            ,
            newController("FlashSentence", {s: exp.Sentence})
                .css("font-size", "18pt")
                .center()
                .print()
                .log()
               // .wait
               //.remove()
            ,
            newText("question", "")
                .cssContainer({"margin-bottom":"4em"})  // this line adds space between the sentence and the scale
                .css("font-size", "18pt")
                .center()
                .print()
            ,
            newScale("grade", "1","2","3","4","5","6","7")
                .labelsPosition("top")
                .before( newText("left", "Totalmente inaceptable") )
                .after( newText("right", "Totalmente aceptable") )
                .css("font-size", "18pt")
                .center()
                .keys()
                .print()
                .wait()
                .log()
    )
    .log("group", exp.group)
    .log("item", exp.itemnum)
    .log("condA", exp.cond_A)
    .log("condB", exp.cond_B)
    .log("EXP", exp.Expt_type)
    ),


Template(PennController.GetTable("fillers.csv"),
    filler =>  newTrial("fillers",
            newText("sep", "*")
                .css("font-size", "24pt")
                .center()
                .print()
            ,
            newTimer("wait", 500)
                .start()
                .wait()
            ,
                getText("sep")
                .remove()
            ,
            newController("FlashSentence", {s: filler.Sentence})
                .css("font-size", "24pt")
                .center()
                .print()
                .log()                //.wait()
              // .remove()
            ,
            newText("question", " ")
                .cssContainer({"margin-bottom":"4em"})  // this line adds space between the sentence and the scale
                .center()
                .print()
            ,
            newScale("grade", 7)
                .css("font-size", "20pt")
                .labelsPosition("top")
                .before( newText("left", "Totalmente inaceptable") 
                    .css("font-size", "18pt"))
                .after( newText("right", "Totalmente aceptable")                 
                    .css("font-size", "18pt"))
                .radio()  // Makes the buttons of the scales appear as radio buttons. 
                .center()
                .keys()
                .once()  // Disables the scale after the first selection has happened. 
                .print()
                .wait()
                .log() 

/*          newScale("natural", 7)
                .before( newText("left", "Totalmente inaceptable") )
                .after( newText("right", "Totalmente aceptable") )
                //.once()   Disables the scale after the first selection has happened. 
                //.slider() Transforms the scale into a slider. 
                .center()
                .keys()
                .print()
                .wait()
                .log()
*/
    )
    .log("item", filler.itemnum)
    .log("condA", filler.cond_A)
    .log("condB", filler.cond_B)
    .log("EXP", filler.Expt_type)
    ),


// Final screen
newTrial("end",
    newText("Thank you for your participation!")
        .center()
        .print()
    ,
    // This link a placeholder: replace it with a URL provided by your participant-pooling platform
    newText("<p><a href='https://www.pcibex.net/' target='_blank'>Click here to validate your submission</a></p>")
        .center()
        .print()
    ,
    // Trick: stay on this trial forever (until tab is closed)
    newButton().wait()
)
.setOption("countsForProgressBar",true)