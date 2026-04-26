window.InitUserScripts = function()
{
var player = GetPlayer();
var object = player.object;
var once = player.once;
var addToTimeline = player.addToTimeline;
var setVar = player.SetVar;
var getVar = player.GetVar;
var update = player.update;
var pointerX = player.pointerX;
var pointerY = player.pointerY;
var showPointer = player.showPointer;
var hidePointer = player.hidePointer;
var slideWidth = player.slideWidth;
var slideHeight = player.slideHeight;
window.Script1 = function()
{
  var player = GetPlayer();

// Get raw scores
var scoreD = player.GetVar("Score_D");
var scoreI = player.GetVar("Score_I");
var scoreS = player.GetVar("Score_S");
var scoreC = player.GetVar("Score_C");

// Prevent divide-by-zero
var total = scoreD + scoreI + scoreS + scoreC;
if (total === 0) total = 1;

// Calculate percentages
var percentD = Math.round((scoreD / total) * 100);
var percentI = Math.round((scoreI / total) * 100);
var percentS = Math.round((scoreS / total) * 100);
var percentC = Math.round((scoreC / total) * 100);

// Save percent variables for use under chart
player.SetVar("Percent_D", percentD);
player.SetVar("Percent_I", percentI);
player.SetVar("Percent_S", percentS);
player.SetVar("Percent_C", percentC);

// Identify dominant types
var maxScore = Math.max(scoreD, scoreI, scoreS, scoreC);
var dominantTypes = [];
if (scoreD === maxScore) dominantTypes.push("Dominance");
if (scoreI === maxScore) dominantTypes.push("Influence");
if (scoreS === maxScore) dominantTypes.push("Steadiness");
if (scoreC === maxScore) dominantTypes.push("Conscientiousness");

// Bird mapping
var typeToBird = {
  "Dominance": "Eagle",
  "Influence": "Peacock",
  "Steadiness": "Dove",
  "Conscientiousness": "Owl"
};

var dominantBirds = dominantTypes.map(function(type) {
  return typeToBird[type];
});

// Set dominant type and bird (for blank-insert usage)
player.SetVar("dominantType", dominantTypes.join(" & "));
player.SetVar("dominantBird", dominantBirds.join(" and "));

// Create summary
var summary = "";
if (dominantTypes.length === 1) {
  summary = "Your dominant personality is " + dominantTypes[0] + ", represented by the " + dominantBirds[0] + ".";
} else {
  summary = "You have a blended personality type: " + dominantTypes.join(", ") + ". ";
  summary += "These are represented by: " + dominantBirds.join(", ") + ".";
}
player.SetVar("DISC_Summary", summary);

// Ranking logic
var scores = [
  { type: "Dominance", bird: "Eagle", score: scoreD },
  { type: "Influence", bird: "Peacock", score: scoreI },
  { type: "Steadiness", bird: "Dove", score: scoreS },
  { type: "Conscientiousness", bird: "Owl", score: scoreC }
];

scores.sort(function(a, b) {
  return b.score - a.score;
});

var rankingText = "";
for (var i = 0; i < scores.length; i++) {
  var p = Math.round((scores[i].score / total) * 100);
  rankingText += (i + 1) + ". " + scores[i].type + " (" + scores[i].bird + ") – " + p + "%\n";
}

player.SetVar("DISC_Ranking", rankingText.trim());

// Add workplace motto and an additional insight
var motto = "";
var insight = "";

if (dominantTypes.length === 1) {
  switch (dominantTypes[0]) {
    case "Dominance":
      motto = "Lead the charge. Break barriers. Deliver results.";
      insight = "People with high Dominance thrive in challenges and take decisive action.";
      break;
    case "Influence":
      motto = "Inspire with energy. Connect through people.";
      insight = "Influencers are enthusiastic, optimistic, and love working with others.";
      break;
    case "Steadiness":
      motto = "Support the team. Build trust. Create harmony.";
      insight = "Steady individuals are reliable, calm, and excel in team environments.";
      break;
    case "Conscientiousness":
      motto = "Perfect the process. Seek precision. Deliver quality.";
      insight = "Conscientious people value accuracy, structure, and careful decision-making.";
      break;
  }
} else {
  motto = "You bring a balanced energy to the workplace. Leverage each strength wisely.";
  insight = "Having multiple dominant traits means you're flexible and dynamic in your approach.";
}

// Combine into a single string
var fullMotto = "Workplace Motto:\n" + motto + "\n\nInsight:\n" + insight;

// Set as DISC_Motto
player.SetVar("DISC_Motto", fullMotto);
}

};
