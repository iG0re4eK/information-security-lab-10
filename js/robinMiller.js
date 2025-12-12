class RobinMiller {
  constructor(bit) {
    this.bit = bit;
    this.minA = null;
    this.maxA = null;
  }

  setBit(bit) {
    if (bit === null) return false;
    if (typeof bit !== "number") return false;
    if (!Number.isInteger(bit)) return false;
    if (bit < 3 || bit > 21) return false;
    this.bit = bit;
    return true;
  }

  maxNumberBit(size) {
    let result = [];

    for (let i = 0; i < size; i++) {
      result.push("1");
    }

    return parseInt(result.join(""), 2);
  }

  randomNumberBit(size) {
    let result = [];

    for (let i = 0; i < size; i++) {
      result.push(Math.random() * 10 > 5 ? "1" : "0");
    }

    result[0] = "1";
    result[result.length - 1] = "1";

    return parseInt(result.join(""), 2);
  }

  isPrime(number) {
    if (number <= 1) return false;

    for (let i = 2; i < number; i++) {
      if (number % i === 0) {
        return false;
      }
    }

    return true;
  }

  isPrimeArray(number) {
    let result = [];

    for (let i = 0; i < number; i++) {
      if (this.isPrime(i)) {
        result.push(i);
      }
    }

    return result;
  }

  checkValidP(pValue, arrayValues) {
    for (let i = 0; i < arrayValues.length; i++) {
      if (pValue % arrayValues[i] === 0) {
        return false;
      }
    }

    return true;
  }

  setIntervalA(aValue, pValue) {
    this.minA = aValue;
    this.maxA = pValue - 1;
  }

  randomValueA(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  sumMod(a, x, n) {
    let p = 1;
    let i = x;

    while (i > 0) {
      const s = i % 2;

      if (s === 1) {
        p = (p * a) % n;
      }

      a = (a * a) % n;
      i = Math.floor((i - s) / 2);
    }

    return p < 0 ? p + n : p;
  }

  mValueAndValueB(pValue) {
    let b = 1;
    let m = Math.floor((pValue - 1) / 2);

    for (let i = 2; i < pValue; i++) {
      if (m % Math.pow(2, i) === 0) {
        b++;
        m /= 2;
      } else break;
    }

    return [b, m];
  }

  robinMiller(pValue, testCount = 5) {
    let [b, m] = this.mValueAndValueB(pValue);

    this.setIntervalA(2, pValue);

    for (let i = 0; i < testCount; i++) {
      let a = this.randomValueA(this.minA, this.maxA);

      let z = this.sumMod(a, m, pValue);

      let testPassed = false;

      if (z === 1 || z === pValue - 1) {
        continue;
      } else {
        for (let j = 0; j < b; j++) {
          z = this.sumMod(z, 2, pValue);

          if (z === pValue - 1) {
            testPassed = true;
            break;
          }

          if (j > 0 && z === 1) {
            return false;
          }

          if (j === b - 1 && z !== pValue - 1) {
            return false;
          }
        }
      }
      if (!testPassed) {
        return false;
      }
    }

    return true;
  }

  generatePrimeNumber() {
    let bitValue = Number(this.bit);
    let p = this.randomNumberBit(bitValue);

    let maxBitNumber = this.maxNumberBit(bitValue);

    let maxPrime = 2000;
    let arrayPrime = [];
    arrayPrime = this.isPrimeArray(maxPrime);

    while (!this.checkValidP(p, arrayPrime)) {
      p += 2;

      if (p > maxBitNumber) {
        return this.generatePrimeNumber();
      }
    }

    return p;
  }
}

export { RobinMiller };
