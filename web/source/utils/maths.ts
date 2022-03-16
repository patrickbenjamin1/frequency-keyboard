export namespace MathsUtils {
  export const round = (value: number, figures: number) => {
    const ordinant = 10 ** figures;
    return Math.round(value * ordinant) / ordinant;
  };
}
