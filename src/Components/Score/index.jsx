export const ScoreSentence = ({score}) => {
    const styles = {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '1.6rem',
        transition: 'all 0.3s'

    }
    return (
        <div className="score-message" style={styles}>Your score is {score} out of 4!</div>
    )
}