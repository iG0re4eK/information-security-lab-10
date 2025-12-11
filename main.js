const result = document.getElementById("result");

const p = 307;
const g = 23;
const a = 229;
const n = p - 1;
const t = 4;
let c = 1;

function isPrime(num) {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
}

function step1(t, count = 100) {
  titleStep(1, "Факторная база.");

  const factorBase = [];

  for (let i = 2; i <= count; i++) {
    if (isPrime(i)) {
      factorBase.push(i);
    }
  }

  return factorBase.slice(0, t);
}

function sumMod(a, x, n) {
  let p = 1;
  let i = x;

  while (i > 0) {
    const s = i % 2;

    if (s === 1) {
      p = (p * a) % n;
    }

    a = (a * a) % n;
    i = (i - s) / 2;
  }

  return p < 0 ? p + n : p;
}

function step2() {
  const k = Math.floor(Math.random() * n);

  const g_k = sumMod(g, k, p);

  return { k, g_k };
}

function factorBase(g_k, s) {
  if (g_k <= 1) return null;

  let result = {};
  let temp = g_k;

  for (const el_s of s) {
    let count = 0;

    while (temp % el_s === 0) {
      temp /= el_s;
      count++;
    }

    if (count > 0) {
      result[el_s] = count;
    }
  }

  return temp === 1 ? result : null;
}

function step3(s) {
  let result = [];

  let { k, g_k } = step2();

  const factorBaseResult = factorBase(g_k, s);

  if (factorBaseResult) {
    titleStep(
      2,
      `Выбираем случайное k: 0 ≤ k < ${n} => k = ${k} и вычисляем g<sup>k</sup>.`
    );
    gKSection(k, g_k);
    titleStep(3, `Попытка разложить по факторной базе g<sup>k</sup>.`);
    result.push({ k: k, g_k: g_k, factorBase: factorBaseResult });
  } else {
    return step3(s);
  }

  decomposefactorBaseSection(result);

  return result;
}

function step4(resultStep3, s) {
  titleStep(4, `Логарифмируем обе части получившегося выражения, получаем`);

  const matrix = [];
  const vector = [];

  resultStep3.forEach((item, idx) => {
    const { k, g_k, factorBase } = item;

    const row = s.map((p) => factorBase[p] || 0);

    matrix.push(row);
    vector.push(sumMod(k, 1, n));

    logarithmicOfPartsSection(s, row, k);
  });

  console.log("matrix:");
  matrix.forEach((row) => {
    console.log(row.join("\t"));
  });
  console.log(" vector: ");
  console.log(vector.join("\n"));

  console.log(`В этом выражении неизвестными являются логарифмы`);
  console.log(`Это сравнение с t неизвестными следует запомнить`);

  return { matrix, vector };
}

function step5(s, t, c, currentResultStep3) {
  console.log(
    `Если сравнений вида (*), полученных на Шаг 4, меньше, чем t + c, то вернуться на Шаг 2`
  );
  console.log(`t = ${t}, c = ${c}, нужно t+c = ${t + c} уравнений`);
  console.log(`Имеем уравнений: ${currentResultStep3.length}`);

  let step4Result = null;

  if (currentResultStep3.length < t + c) {
    const needed = t + c - currentResultStep3.length;
    console.log(`\n Нужно найти еще ${needed} уравнений.`);

    const allEquations = [...currentResultStep3];

    while (allEquations.length < t + c) {
      const additionalEquations = step3(s);
      allEquations.push(...additionalEquations);
      console.log(`Найдено еще уравнение. Всего: ${allEquations.length}`);
      step4Result = step4(allEquations, s);
    }

    console.log(
      `\nТеперь имеем ${allEquations.length} уравнений (нужно ${t + c})`
    );

    return {
      equations: allEquations,
      matrix: step4Result.matrix,
      vector: step4Result.vector,
      c: c,
    };
  } else {
    console.log(`Можно переходить к решению системы.`);
    console.log(`Используем только первые ${t + c} уравнений для системы`);

    const equationsToUse = currentResultStep3.slice(0, t + c);
    step4Result = step4(equationsToUse, s);

    return {
      equations: equationsToUse,
      matrix: step4Result.matrix,
      vector: step4Result.vector,
      c: c,
    };
  }
}

function modInverse(a, m) {
  a = ((a % m) + m) % m;
  for (let x = 1; x < m; x++) {
    if ((a * x) % m === 1) {
      return x;
    }
  }
  return -1;
}

function egcd(a, b) {
  if (b === 0) return [a, 1, 0];
  const [g, x1, y1] = egcd(b, a % b);
  return [g, y1, x1 - Math.floor(a / b) * y1];
}

function solveLinearSystem(modulo, matrix, vector) {
  const n = matrix.length;
  const m = matrix[0].length;
  const mod = modulo;

  let A = matrix.map((row) => [...row]);
  let b = [...vector];

  console.log(`\nРешаем систему ${n}×${m} по модулю ${mod}`);

  for (let col = 0; col < m && col < n; col++) {
    let pivot = -1;
    for (let row = col; row < n; row++) {
      if (A[row][col] % mod !== 0) {
        pivot = row;
        break;
      }
    }

    if (pivot === -1) continue;

    if (pivot !== col) {
      [A[col], A[pivot]] = [A[pivot], A[col]];
      [b[col], b[pivot]] = [b[pivot], b[col]];
    }

    const inv = modInverse(A[col][col], mod);
    if (inv === -1) {
      console.log(`Элемент ${A[col][col]} необратим по модулю ${mod}`);
      continue;
    }

    for (let j = col; j < m; j++) {
      A[col][j] = (A[col][j] * inv) % mod;
    }
    b[col] = (b[col] * inv) % mod;

    for (let row = 0; row < n; row++) {
      if (row !== col && A[row][col] !== 0) {
        const factor = A[row][col];
        for (let j = col; j < m; j++) {
          A[row][j] = (A[row][j] - factor * A[col][j]) % mod;
          if (A[row][j] < 0) A[row][j] += mod;
        }
        b[row] = (b[row] - factor * b[col]) % mod;
        if (b[row] < 0) b[row] += mod;
      }
    }
  }

  const solution = new Array(m).fill(0);
  const hasSolution = new Array(m).fill(false);

  for (let i = 0; i < m; i++) {
    let nonZeroRow = -1;
    for (let j = 0; j < n; j++) {
      if (A[j][i] !== 0) {
        if (nonZeroRow === -1) {
          nonZeroRow = j;
        } else {
          console.log(`Конфликт для переменной x${i}`);
          return null;
        }
      }
    }

    if (nonZeroRow !== -1) {
      solution[i] = b[nonZeroRow];
      hasSolution[i] = true;
    }
  }

  return { solution, hasSolution };
}

function step6(matrix, vector, n, s, g) {
  titleStep(6, `Решение системы уравнений`);
  const neededEquations = t + 1;

  if (matrix.length < neededEquations) {
    console.log(
      `Нужно больше уравнений! Требуется: ${neededEquations}, есть: ${matrix.length}`
    );
    return null;
  }

  const A = matrix.slice(0, neededEquations);
  const b = vector.slice(0, neededEquations);

  const result = solveLinearSystem(n, A, b);

  if (!result) {
    console.log("Система не имеет решения!");
    return null;
  }

  console.log("\nНайденные логарифмы элементов факторной базы:");
  const logs = {};
  for (let i = 0; i < s.length; i++) {
    if (result.hasSolution[i]) {
      logs[s[i]] = result.solution[i];
      console.log(`log_${g}(${s[i]}) ≡ ${result.solution[i]} (mod ${n})`);
    } else {
      console.log(`log_${g}(${s[i]}) — не определен`);
    }
  }

  console.log(logs);

  return logs;
}

function step7(n, g, p, a) {
  const k = Math.floor(Math.random() * n);

  const ag_k = sumMod(a * sumMod(g, k, p), 1, p);

  return { k, ag_k };
}

function step8(g, s, n, p, a) {
  let result = [];
  let { k, ag_k } = step7(n, g, p, a);

  const factorBaseResult = factorBase(ag_k, s);

  if (factorBaseResult) {
    titleStep(
      7,
      `Выбрать случайное k: 0 ≤ k < ${n} и вычислить ${a} * ${g}<sup>${k}</sup> mod ${p}`
    );
    titleStep(8, `Попытка разложить по факторной базе ${g}^${k} mod ${p}`);
    result.push({ k: k, ag_k: ag_k, factorBase: factorBaseResult });
  } else {
    return step8(g, s, n, p, a);
  }

  result.forEach((el) => {
    let text = "";
    text += `k: ${el.k} \t a*g^k: ${el.ag_k} \t`;
    const factors = Object.entries(el.factorBase)
      .map(([prime, power]) => `${prime}^${power}`)
      .join(" * ");
    text += factors;
    console.log(text);
  });

  return result;
}

function step9(resultStep8, s, n, g, logs) {
  titleStep(9, `Логарифмируем обе части последнего равенства, получаем`);

  let log_a = null;

  resultStep8.forEach((item) => {
    const { k, factorBase } = item;

    const row = s.map((p) => factorBase[p] || 0);

    let rightSide = 0;
    for (let j = 0; j < s.length; j++) {
      if (row[j] > 0) {
        rightSide = (rightSide + row[j] * logs[s[j]]) % n;
      }
    }

    log_a = (rightSide - k) % n;
    if (log_a < 0) log_a += n;

    console.log(`log_${g}(${a}) ≡ ${rightSide} - ${k} ≡ ${log_a} (mod ${n})`);
  });

  return log_a;
}

function checkResult(x, g, a, n) {
  if (Array.isArray(x)) {
    x = x[0]?.value || x[x.length - 1]?.value;
  }
  console.log(`g^${x} = ${sumMod(g, x, p)}; a = ${a}`);
  console.log(
    `Проверка: ${g}^${x} mod ${p} = ${sumMod(g, x, p)} ≡ (a: ${a}) (mod ${p})`
  );
  console.log(`Дискретный логарифм log_${g}(${a}) ≡ ${x} (mod ${n})`);
}

function titleStep(step, text) {
  const stepDiv = document.createElement("div");
  stepDiv.innerHTML = `Шаг ${step}: ${text}`;
  stepDiv.className = "step";
  result.appendChild(stepDiv);
}

function factorBaseSection(s) {
  const factorBaseDiv = document.createElement("div");
  factorBaseDiv.className = "section-step factor-base";
  factorBaseDiv.innerHTML = `S = { ${s.join(", ")} }`;
  result.appendChild(factorBaseDiv);
}

function gKSection(k, g_k) {
  const gKDiv = document.createElement("div");
  gKDiv.className = "section-step";
  gKDiv.innerHTML = `g<sup>k</sup> = ${g}<sup>${k}</sup> mod ${p} = ${g_k}.`;
  result.appendChild(gKDiv);
}

function decomposefactorBaseSection(array) {
  const decomposefactorBaseDiv = document.createElement("div");
  decomposefactorBaseDiv.className = "section-step decompose-factor-base";
  const dict = array[0];

  decomposefactorBaseDiv.innerHTML = `g<sup>k</sup> = ${dict.g_k} = `;
  array.forEach((el) => {
    const factors = Object.entries(el.factorBase)
      .map(([prime, power]) => `${prime}<sup>${power > 1 ? power : ""}</sup>`)
      .join(" * ");
    decomposefactorBaseDiv.innerHTML += factors;
  });
  result.appendChild(decomposefactorBaseDiv);
}

function logarithmicOfPartsSection(s, row, k) {
  const logarithmicOfPartsDiv = document.createElement("div");
  logarithmicOfPartsDiv.className = "section-step logarithmic-of-parts";

  const multiPow = s.reduce((multi, el_s, index) => {
    return (multi *= Math.pow(el_s, row[index]));
  }, 1);

  const equation =
    s
      .map((p, j) => {
        const coeff = row[j];
        return coeff
          ? `${coeff > 1 ? coeff + " *" : ""} log<sub>${g}</sub>(${p})`
          : null;
      })
      .filter((x) => x)
      .join(" + ") || "0";

  logarithmicOfPartsDiv.innerHTML = `${k} ≡ ${equation} mod ${n} <br/> ${k} ≡ log<sub>${g}</sub>(${multiPow}) mod ${n} <br/> ${g}<sup>${k}</sup> ≡ ${multiPow} mod ${p}`;

  result.appendChild(logarithmicOfPartsDiv);
}

function init() {
  const s = step1(t);
  factorBaseSection(s);

  let resultStep3 = step3(s);

  let { matrix, vector } = step4(resultStep3, s);

  titleStep(5, `Проверка количества уравнений`);

  ({ matrix, vector } = step5(s, t, c, resultStep3));

  const logs = step6(matrix, vector, n, s, g);

  if (logs === null || Object.keys(logs).length !== t) {
    console.clear();
    result.innerHTML = "<h2>Решение:</h2>";
    return init();
  }

  let resultStep8 = step8(g, s, n, p, a);

  const x = step9(resultStep8, s, n, g, logs);

  checkResult(x, g, a, n);
}

init();
