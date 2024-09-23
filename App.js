import React, { useState, useEffect } from "react";
import { shuffle } from "lodash";
import { Clock, RefreshCw } from "lucide-react";

const concepts = [
  {
    id: 1,
    concept: "Pierre Poilievre",
    detail: "Lifelong conservative, investor, fighter for the people",
  },
  {
    id: 2,
    concept: "Major Ideas",
    detail: "Belief in equality, value of human life, individual freedom",
  },
  {
    id: 3,
    concept: "Party Actions",
    detail:
      "Opposition to assisted dying, cancel culture, federal overreach in healthcare",
  },
  {
    id: 4,
    concept: "Plans for Canada",
    detail:
      "Opposition to carbon tax, focus on economic growth and traditional values",
  },
  {
    id: 5,
    concept: "Conservative Values",
    detail: "Pride in ourselves, state as servant not master",
  },
  {
    id: 6,
    concept: "Healthcare Policy",
    detail: "Tailoring salutations to the needs of each province",
  },
  {
    id: 7,
    concept: "Educational Stance",
    detail: "Speaking out against cancel culture in institutions",
  },
  {
    id: 8,
    concept: "Economic Approach",
    detail: "Promoting growth through resource development and lower taxes",
  },
  {
    id: 9,
    concept: "Social Policy",
    detail: "Skepticism towards gender identity policies",
  },
  {
    id: 10,
    concept: "Governmental Structure",
    detail: "Decentralizing power to the provinces",
  },
];

const MatchingGame = () => {
  const [selectedConcept, setSelectedConcept] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [shuffledConcepts, setShuffledConcepts] = useState([]);
  const [shuffledDetails, setShuffledDetails] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    resetGame();
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameOver(true);
    }
  }, [timeLeft, gameOver]);

  const resetGame = () => {
    setShuffledConcepts(shuffle(concepts));
    setShuffledDetails(shuffle(concepts));
    setMatchedPairs([]);
    setScore(0);
    setTimeLeft(300);
    setGameOver(false);
  };

  const handleConceptClick = (concept) => {
    setSelectedConcept(concept);
    checkForMatch(concept, selectedDetail);
  };

  const handleDetailClick = (detail) => {
    setSelectedDetail(detail);
    checkForMatch(selectedConcept, detail);
  };

  const checkForMatch = (concept, detail) => {
    if (concept && detail) {
      if (concept.id === detail.id) {
        setMatchedPairs([...matchedPairs, concept.id]);
        setScore(score + 10);
        setSelectedConcept(null);
        setSelectedDetail(null);
      } else {
        setTimeout(() => {
          setSelectedConcept(null);
          setSelectedDetail(null);
        }, 1000);
        setScore(Math.max(0, score - 5));
      }
    }
  };

  const isMatched = (id) => matchedPairs.includes(id);

  return (
    <div className="p-4 max-w-4xl mx-auto bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-4 text-center text-blue-800">
        Conservative Party Matching Game
      </h2>
      <div className="flex justify-between items-center mb-4">
        <div className="text-xl font-semibold">Score: {score}</div>
        <div className="flex items-center text-xl font-semibold">
          <Clock className="mr-2" />
          Time: {Math.floor(timeLeft / 60)}:
          {(timeLeft % 60).toString().padStart(2, "0")}
        </div>
        <button
          onClick={resetGame}
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          <RefreshCw className="mr-2" />
          Reset Game
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-xl font-semibold mb-2 text-blue-700">Concepts</h3>
          {shuffledConcepts.map((item) => (
            <button
              key={item.id}
              onClick={() => handleConceptClick(item)}
              className={`w-full p-2 mb-2 text-left rounded transition-colors ${
                isMatched(item.id)
                  ? "bg-green-200 text-green-800"
                  : selectedConcept === item
                  ? "bg-blue-200 text-blue-800"
                  : "bg-white text-gray-800 hover:bg-gray-200"
              }`}
              disabled={isMatched(item.id) || gameOver}
            >
              {item.concept}
            </button>
          ))}
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2 text-blue-700">Details</h3>
          {shuffledDetails.map((item) => (
            <button
              key={item.id}
              onClick={() => handleDetailClick(item)}
              className={`w-full p-2 mb-2 text-left rounded transition-colors ${
                isMatched(item.id)
                  ? "bg-green-200 text-green-800"
                  : selectedDetail === item
                  ? "bg-blue-200 text-blue-800"
                  : "bg-white text-gray-800 hover:bg-gray-200"
              }`}
              disabled={isMatched(item.id) || gameOver}
            >
              {item.detail}
            </button>
          ))}
        </div>
      </div>
      {(gameOver || matchedPairs.length === concepts.length) && (
        <div className="mt-4 text-center">
          <div className="text-2xl font-bold text-blue-600 bg-blue-100 p-4 rounded mb-2">
            {matchedPairs.length === concepts.length
              ? `Congratulations! You've matched all pairs with a score of ${score}!`
              : `Game Over! Your final score is ${score}.`}
          </div>
          <div className="text-sm text-gray-600 italic">
            Made by Joslynn O'Neill and Roan Delaney with help from Claude 3.5
            AI
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchingGame;
