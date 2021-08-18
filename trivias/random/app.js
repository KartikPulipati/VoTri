$(document).ready(function() {

    // event listeners
    $("#remaining-time").hide();
    $("#start").on('click', trivia.startGame);
    $(document).on('click', '.option', trivia.guessChecker);

})


var trivia = {
    gameStarted: false,
    // trivia properties
    correct: 0,
    incorrect: 0,
    unanswered: 0,
    currentSet: 0,
    timer: 20,
    timerOn: false,
    timerId: '',

    // questions options and answers data
    questions: {
        q1: 'What color is an orange?',
        q2: 'Who sang the song "Never Gonna Give You Up"?',
        q3: 'What number is the same as 1?',
        q4: 'Who is Super Mario\'s brother? ',
        q5: "Which basketball team won the nationals in 2016?",
        q6: 'When is Christmas?',
        q7: "Which is the most populous county in California?"
    },

    options: {
        q1: ['Orange', 'Red', 'Green', 'Blue'],
        q2: ['BTS', 'The Beatles', 'Kanye West', 'Rick Astley'],
        q3: ['5', '2', '1', '3'],
        q4: ['Yoshi', 'Princess Peach', 'Luigi', 'Wario'],
        q5: ['The Golden State Warriors', 'The Nuggets', 'The Knicks', 'The Lakers'],
        q6: ['Jan. 1', 'Dec. 25', 'Oct. 31', 'Feb. 14'],
        q7: ['San Francisco', 'Los Angeles', 'San Diego', 'Alameda']
    },

    answers: {
        q1: 'Orange',
        q2: 'Rick Astley',
        q3: '1',
        q4: 'Luigi',
        q5: 'The Golden State Warriors',
        q6: 'Dec. 25',
        q7: 'Los Angeles'
    },

    // trivia methods
    // method to initialize game
    startGame: function() {
        trivia.gameStarted = true;
        // restarting game results
        trivia.currentSet = 0;
        trivia.correct = 0;
        trivia.incorrect = 0;
        trivia.unanswered = 0;
        clearInterval(trivia.timerId);

        // show game section
        $('#game').show();

        //  empty last results
        $('#results').html('');

        // show timer
        $('#timer').text(trivia.timer);

        // remove start button
        $('#start').hide();

        $('#remaining-time').show();

        // ask first question
        trivia.nextQuestion();

    },
    // method to loop through and display questions and options
    nextQuestion: function() {

        // set timer to 20 seconds each question
        trivia.timer = 20;
        $('#timer').removeClass('last-seconds');
        $('#timer').text(trivia.timer);

        // to prevent timer speed up
        if (!trivia.timerOn) {
            trivia.timerId = setInterval(trivia.timerRunning, 1000);
        }

        // gets all the questions then indexes the current questions
        var questionContent = Object.values(trivia.questions)[trivia.currentSet];
        $('#question').text(questionContent);


        // an array of all the user options for the current question
        var questionOptions = Object.values(trivia.options)[trivia.currentSet];

        // creates all the trivia guess options in the html
        $.each(questionOptions, function(index, key) {
            $('#options').append($('<button class="option btn btn-info btn-lg">' + key + '</button>'));
        })

    },
    // method to decrement counter and count unanswered if timer runs out
    timerRunning: function() {
        // if timer still has time left and there are still questions left to ask
        if (trivia.timer > -1 && trivia.currentSet < Object.keys(trivia.questions).length) {
            $('#timer').text(trivia.timer);
            trivia.timer--;
            if (trivia.timer === 4) {
                $('#timer').addClass('last-seconds');
            }
        }

        // the time has run out and increment unanswered, run result
        else if (trivia.timer === -1) {
            trivia.unanswered++;
            trivia.result = false;
            clearInterval(trivia.timerId);
            resultId = setTimeout(trivia.guessResult, 1000);
            $('#results').html('<h3>Out of time! The answer was ' + Object.values(trivia.answers)[trivia.currentSet] + '</h3>');
        }

        // if all the questions have been shown end the game, show results
        else if (trivia.currentSet === Object.keys(trivia.questions).length) {
            trivia.gameStarted = false;
            // adds results of game (correct, incorrect, unanswered) to the page
            $('#results')
                .html('<h3>Thank you for playing!</h3>' +
                    '<p>Correct: ' + trivia.correct + '</p>' +
                    '<p>Incorrect: ' + trivia.incorrect + '</p>' +
                    '<p>Unaswered: ' + trivia.unanswered + '</p>');

            // hide game sction
            $('#game').hide();

            // show start button to begin a new game

        }

    },
    // method to evaluate the option clicked
    guessChecker: function() {

        // timer ID for gameResult setTimeout
        var resultId;

        // the answer to the current question being asked
        var currentAnswer = Object.values(trivia.answers)[trivia.currentSet];

        // if the text of the option picked matches the answer of the current question, increment correct
        if ($(this).text() === currentAnswer) {
            // turn button green for correct
            $(this).addClass('btn-success').removeClass('btn-info');

            trivia.correct++;
            clearInterval(trivia.timerId);
            resultId = setTimeout(trivia.guessResult, 1000);
            $('#results').html('<h3>Correct Answer!</h3>');
        }

        // else the user picked the wrong option, increment incorrect
        else {
            // turn button clicked red for incorrect
            $(this).addClass('btn-danger').removeClass('btn-info');

            trivia.incorrect++;
            clearInterval(trivia.timerId);
            resultId = setTimeout(trivia.guessResult, 1000);
            $('#results').html('<h3>Better luck next time! ' + currentAnswer + '</h3>');
        }

    },

    // method to remove previous question results and options
    guessResult: function() {

        // increment to next question set
        trivia.currentSet++;

        // remove the options and results
        $('.option').remove();
        $('#results h3').remove();

        // begin next question
        trivia.nextQuestion();

    }

}