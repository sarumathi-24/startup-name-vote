import { useState } from 'react'
import './App.css'

const initialStartups = [
  {
    id: 1,
    startupName: 'PitchPilot',
    tagline: 'Practice investor pitches with friendly AI feedback.',
    votes: 8,
    category: 'AI Tools',
  },
  {
    id: 2,
    startupName: 'SnackStack',
    tagline: 'Office snack boxes based on team mood and taste.',
    votes: 6,
    category: 'Food Tech',
  },
  {
    id: 3,
    startupName: 'GreenCart',
    tagline: 'Find local low-waste shops before you buy online.',
    votes: 8,
    category: 'Climate',
  },
  {
    id: 4,
    startupName: 'SkillSprint',
    tagline: 'Tiny daily challenges for learning job-ready skills.',
    votes: 4,
    category: 'Education',
  },
]

function WinnerBadge({ isWinner, isTie }) {
  if (!isWinner) {
    return null
  }

  return (
    <span className={isTie ? 'badge badge-tie' : 'badge'}>
      {isTie ? 'Tied leader' : 'Top pick'}
    </span>
  )
}

function VoteButton({ onVote }) {
  return (
    <button className="vote-button" type="button" onClick={onVote}>
      Vote
    </button>
  )
}

function StartupCard({ startup, isWinner, isTie, isTrending, onVote }) {
  return (
    <article className={isTrending ? 'startup-card trending' : 'startup-card'}>
      <div className="card-top">
        <span className="category">{startup.category}</span>
        <WinnerBadge isWinner={isWinner} isTie={isTie} />
      </div>

      <h2>{startup.startupName}</h2>
      <p>{startup.tagline}</p>

      {isTrending && <p className="trend-text">Trending now</p>}

      <div className="card-actions">
        <strong>{startup.votes} votes</strong>
        <VoteButton onVote={onVote} />
      </div>
    </article>
  )
}

function App() {
  const [startups, setStartups] = useState(initialStartups)

  const totalVotes = startups.reduce((sum, startup) => sum + startup.votes, 0)
  const highestVotes = startups.length
    ? Math.max(...startups.map((startup) => startup.votes))
    : 0
  const topStartups = startups.filter((startup) => startup.votes === highestVotes)
  const isTie = topStartups.length > 1
  const trendingStartupId = startups.find(
    (startup) => startup.votes === highestVotes,
  )?.id
  const resultText =
    startups.length === 0
      ? 'No startups yet'
      : isTie
        ? 'Tie result'
        : topStartups[0].startupName

  function handleVote(id) {
    setStartups((currentStartups) =>
      currentStartups.map((startup) =>
        startup.id === id
          ? { ...startup, votes: startup.votes + 1 }
          : startup,
      ),
    )
  }

  function handleReset() {
    setStartups((currentStartups) =>
      currentStartups.map((startup) => ({ ...startup, votes: 0 })),
    )
  }

  function handleClear() {
    setStartups([])
  }

  function handleRestore() {
    setStartups(initialStartups)
  }

  return (
    <main className="app">
      <section className="hero-section">
        <p className="eyebrow">Founder voting room</p>
        <h1>Startup Name Vote</h1>
        <p className="intro">
          Vote for the startup idea you like most. The winner updates as the
          votes change.
        </p>
      </section>

      <section className="summary-bar">
        <div>
          <span>Total votes</span>
          <strong>{totalVotes}</strong>
        </div>

        <div>
          <span>Current result</span>
          <strong>{resultText}</strong>
        </div>
      </section>

      <section className="control-row">
        <button type="button" onClick={handleReset}>
          Reset votes
        </button>
        <button type="button" onClick={handleClear}>
          Clear list
        </button>
      </section>

      {startups.length === 0 ? (
        <section className="empty-state">
          <h2>No startup ideas yet</h2>
          <p>Add startup objects to the array to start voting.</p>
          <button type="button" onClick={handleRestore}>
            Restore startups
          </button>
        </section>
      ) : (
        <>
          {isTie && (
            <section className="tie-message">
              Tie result: {topStartups.map((startup) => startup.startupName).join(', ')}
            </section>
          )}

          <section className="startup-grid">
            {startups.map((startup) => (
              <StartupCard
                key={startup.id}
                startup={startup}
                isWinner={startup.votes === highestVotes}
                isTie={isTie}
                isTrending={startup.id === trendingStartupId && startup.votes > 0}
                onVote={() => handleVote(startup.id)}
              />
            ))}
          </section>
        </>
      )}
    </main>
  )
}

export default App
