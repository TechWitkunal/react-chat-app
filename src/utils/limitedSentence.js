export const limitSentence = (sentence, limit) => {
    if (sentence.length <= limit) {
        return sentence;
    } else {
        return sentence.slice(0, limit) + '...';
    }
}