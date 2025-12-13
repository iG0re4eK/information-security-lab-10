import { RobinMiller } from "./robinMiller.js";

const form = document.getElementById("form");
const result = document.getElementById("result");
const robinMillerMethod = new RobinMiller();
const startPageBtn = document.getElementById("startPageBtn");

startPageBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  clearErrors();

  const inputs = form.querySelectorAll('input[type="text"]');
  inputs.forEach((input) => {
    input.classList.remove("error");
  });

  const pValue = form.querySelector('[name="pValue"]').value.trim();
  const gValue = form.querySelector('[name="gValue"]').value.trim();
  const aValue = form.querySelector('[name="aValue"]').value.trim();
  const tValue = form.querySelector('[name="tValue"]').value.trim();
  const cValue = form.querySelector('[name="cValue"]').value.trim();

  let hasError = false;

  if (!pValue) {
    showError(
      form.querySelector('[name="pValue"]'),
      "Поле не должно быть пустым"
    );
    hasError = true;
  }

  if (!gValue) {
    showError(
      form.querySelector('[name="gValue"]'),
      "Поле не должно быть пустым"
    );
    hasError = true;
  }

  if (!aValue) {
    showError(
      form.querySelector('[name="aValue"]'),
      "Поле не должно быть пустым"
    );
    hasError = true;
  }

  if (!tValue) {
    showError(
      form.querySelector('[name="tValue"]'),
      "Поле не должно быть пустым"
    );
    hasError = true;
  }

  if (!cValue) {
    showError(
      form.querySelector('[name="cValue"]'),
      "Поле не должно быть пустым"
    );
    hasError = true;
  }

  if (hasError) return;

  const p = parseInt(pValue);
  const g = parseInt(gValue);
  const a = parseInt(aValue);
  const t = parseInt(tValue);
  const c = parseInt(cValue);

  const pError = validInput(p);
  const gError = validInput(g);
  const aError = validInput(a);
  const tError = validInput(t);
  const cError = validInput(c);

  if (pError) {
    showError(form.querySelector('[name="pValue"]'), pError);
    hasError = true;
  }

  if (gError) {
    showError(form.querySelector('[name="gValue"]'), gError);
    hasError = true;
  }

  if (aError) {
    showError(form.querySelector('[name="aValue"]'), aError);
    hasError = true;
  }

  if (tError) {
    showError(form.querySelector('[name="tValue"]'), tError);
    hasError = true;
  }

  if (cError) {
    showError(form.querySelector('[name="cValue"]'), cError);
    hasError = true;
  }

  if (hasError) return;

  if (!robinMillerMethod.robinMiller(p)) {
    showError(
      form.querySelector('[name="pValue"]'),
      "Должно быть простым числом"
    );
    return;
  }

  if (g <= 0 || g >= p) {
    showError(
      form.querySelector('[name="gValue"]'),
      `g должно быть в диапазоне: 1 < g < ${p}`
    );
    return;
  }

  if (a <= 0 || a >= p) {
    showError(
      form.querySelector('[name="aValue"]'),
      `a должно быть в диапазоне: 0 < a < ${p}`
    );
    return;
  }

  if (t <= 0) {
    showError(
      form.querySelector('[name="tValue"]'),
      "t должно быть положительным числом"
    );
    return;
  }

  if (t > p - 1) {
    showError(
      form.querySelector('[name="tValue"]'),
      `t не может быть больше ${p - 1} (p-1)`
    );
    return;
  }

  if (c <= 0) {
    showError(
      form.querySelector('[name="cValue"]'),
      "c должно быть положительным числом"
    );
    return;
  }

  if (c > t) {
    showError(
      form.querySelector('[name="cValue"]'),
      `c не может быть больше t`
    );
    return;
  }

  if (c > p - 1) {
    showError(
      form.querySelector('[name="cValue"]'),
      `Не может быть больше ${p - 1}`
    );
    return;
  }

  if (!isGenerator(g, p)) {
    showError(
      form.querySelector('[name="gValue"]'),
      `Может не быть генератором для ${p}`
    );
    return;
  }

  const nValueDiv = form.querySelector('[name="nValue"]');
  const n = p - 1;

  nValueDiv.innerHTML = `n = ${n}`;

  clearErrors();
  init(p, g, a, n, t, c);

  result.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
});

function isGenerator(g, p) {
  const n = p - 1;

  if (sumMod(g, n, p) !== 1) return false;

  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) {
      if (sumMod(g, i, p) === 1 || sumMod(g, n / i, p) === 1) {
        return false;
      }
    }
  }
  return true;
}

function validInput(value) {
  if (value === null || value === undefined) {
    return "Поле не должно быть пустым";
  }

  if (isNaN(value)) {
    return "Значение должно быть числом";
  }

  if (!Number.isInteger(value)) {
    return "Значение должно быть целочисленным";
  }

  if (value <= 0) {
    return "Значение должно быть положительным числом";
  }

  return "";
}

function showError(input, message) {
  input.classList.add("error");

  let errorElement = input.parentNode.querySelector(".error-message");
  if (errorElement) {
    errorElement.remove();
  }

  errorElement = document.createElement("div");
  errorElement.className = "error-message";
  errorElement.textContent = message;

  input.parentNode.appendChild(errorElement);
}

function clearErrors() {
  const inputs = form.querySelectorAll('input[type="text"]');
  inputs.forEach((input) => {
    input.classList.remove("error");
    const errorElement = input.parentNode.querySelector(".error-message");
    if (errorElement) {
      errorElement.remove();
    }
  });
}

function isPrime(num) {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
}

function step1(t, p) {
  titleStep(1, "Факторная база.");

  const factorBase = [];

  for (let i = 2; i <= p; i++) {
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

function step2(n, g, p) {
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

function step3(s, g, p, n) {
  let result = [];

  let { k, g_k } = step2(n, g, p);

  const factorBaseResult = factorBase(g_k, s);

  if (factorBaseResult) {
    titleStep(
      2,
      `Выбираем случайное k: 0 ≤ k < ${n} => k = ${k} и вычисляем g<sup>k</sup>.`
    );
    gKSection(k, g_k, g, p);
    titleStep(3, `Попытка разложить по факторной базе g<sup>k</sup>.`);
    result.push({ k: k, g_k: g_k, factorBase: factorBaseResult });
  } else {
    return step3(s, g, p, n);
  }

  decomposefactorBaseGKSection(result);

  return result;
}

function step4(resultStep3, s, n, t, c, g, p) {
  titleStep(4, `Логарифмируем обе части получившегося выражения, получаем`);

  const matrix = [];
  const vector = [];

  resultStep3.forEach((item, idx) => {
    const { k, g_k, factorBase } = item;

    const row = s.map((p) => factorBase[p] || 0);

    matrix.push(row);
    vector.push(sumMod(k, 1, n));

    logarithmicOfPartsSection(s, row, k, g, n, p);
  });

  findAllEquationSection(`Нашли ${resultStep3.length}/${t + c}.`);

  return { matrix, vector };
}

function step5(s, currentResultStep3, t, c, n, g, p) {
  titleStep(5, `Проверка количества уравнений`);
  findAllEquationSection(
    `Если сравнений вида (*), полученных на Шаг 4, меньше, чем t + c, то вернуться на Шаг 2.`
  );
  findAllEquationSection(
    `t = ${t}, c = ${c}, нужно t + c = ${t + c} уравнений`
  );
  findAllEquationSection(`Количество уравнений: ${currentResultStep3.length}.`);

  let step4Result = null;

  if (currentResultStep3.length < t + c) {
    const needed = t + c - currentResultStep3.length;
    findAllEquationSection(`Нужно найти еще ${needed}.`);

    const allEquations = [...currentResultStep3];

    while (allEquations.length < t + c) {
      const additionalEquations = step3(s, g, p, n);

      allEquations.push(...additionalEquations);

      step4Result = step4(allEquations, s, n, t, c, g, p);
    }

    findAllEquationSection(`Можно переходить к решению системы.`);

    return {
      equations: allEquations,
      matrix: step4Result.matrix,
      vector: step4Result.vector,
      c: c,
    };
  } else {
    findAllEquationSection(`Можно переходить к решению системы.`);
    findAllEquationSection(
      `Используем только первые ${t + c} уравнений для системы`
    );

    const equationsToUse = currentResultStep3.slice(0, t + c);
    step4Result = step4(equationsToUse, s, n, t, c, g, p);

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

function solveLinearSystem(modulo, matrix, vector, s, g) {
  const n = matrix.length;
  const m = matrix[0].length;
  const mod = modulo;

  let A = matrix.map((row) => [...row]);
  let b = [...vector];

  matrixVectorSection(s, A, b, g);

  for (let col = 0; col < m && col < n; col++) {
    stepLinearSystemSection(`<h5>Колонка ${col + 1}:</h5>`);

    let pivot = -1;
    for (let row = col; row < n; row++) {
      if (A[row][col] % mod !== 0) {
        pivot = row;
        break;
      }
    }

    if (pivot === -1) {
      stepLinearSystemSection(
        `<p>Нет ненулевого опорного элемента в столбце ${col + 1}</p>`
      );
      continue;
    }

    stepLinearSystemSection(
      `<p>Опорный элемент: A<sub>${pivot + 1}</sub><sub>${col + 1}</sub> = ${
        A[pivot][col]
      }</p>`
    );

    if (pivot !== col) {
      [A[col], A[pivot]] = [A[pivot], A[col]];
      [b[col], b[pivot]] = [b[pivot], b[col]];
      stepLinearSystemSection(
        `<p>Перестановка строк ${col + 1} и ${pivot + 1}</p>`
      );
      stepLinearSystemSection(`<p>Матрица после перестановки:</p>`);
      matrixVectorSection(s, A, b, g);
    }

    const inv = modInverse(A[col][col], mod);
    if (inv === -1) {
      stepLinearSystemSection(
        `<p>Обратный элемент для ${A[col][col]} по модулю ${mod} не существует</p>`
      );
      continue;
    }

    stepLinearSystemSection(
      `<p>Обратный элемент: ${inv} (${A[col][col]} * ${inv} ≡ 1 mod ${mod})</p>`
    );

    for (let j = col; j < m; j++) {
      A[col][j] = (A[col][j] * inv) % mod;
    }
    b[col] = (b[col] * inv) % mod;

    stepLinearSystemSection(`<p>После нормализации строки ${col + 1}:</p>`);
    matrixVectorSection(s, A, b, g);

    for (let row = 0; row < n; row++) {
      if (row !== col && A[row][col] !== 0) {
        const factor = A[row][col];
        const rowNum = row + 1;
        const colNum = col + 1;
        stepLinearSystemSection(
          `<p>Обрабатываем строку ${rowNum}:</p>` +
            `<p>Элемент в столбце ${colNum} равен ${factor}</p>` +
            `<p>Вычитаем из строки ${rowNum} строку ${colNum}, умноженную на ${factor}</p>` +
            `<p>(чтобы обнулить элемент A<sub>${rowNum}</sub><sub>${colNum}</sub>)</p>`
        );

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
          stepLinearSystemSection(
            `<p>Ошибка: столбец ${
              i + 1
            } имеет несколько ненулевых элементов</p>`
          );
          return null;
        }
      }
    }

    if (nonZeroRow !== -1) {
      solution[i] = b[nonZeroRow];
      hasSolution[i] = true;
    }
  }

  matrixVectorSection(s, A, b, g);

  return { solution, hasSolution };
}

function step6(matrix, vector, s, t, n, g) {
  titleStep(6, `Решение системы уравнений`);
  const neededEquations = t + 1;

  if (matrix.length < neededEquations) {
    return null;
  }

  const A = matrix.slice(0, neededEquations);
  const b = vector.slice(0, neededEquations);

  const result = solveLinearSystem(n, A, b, s, g);

  if (!result) {
    return null;
  }

  const logs = {};
  for (let i = 0; i < s.length; i++) {
    if (result.hasSolution[i]) {
      logs[s[i]] = result.solution[i];

      solveLinearSystemSection(
        `log<sub>${g}</sub>(${s[i]}) ≡ ${result.solution[i]} mod ${n}`
      );
    }
  }

  return logs;
}

function step7(n, a, g, p) {
  const k = Math.floor(Math.random() * n);

  const ag_k = sumMod(a * sumMod(g, k, p), 1, p);

  return { k, ag_k };
}

function step8(s, n, a, g, p) {
  let result = [];
  let { k, ag_k } = step7(n, a, g, p);

  const factorBaseResult = factorBase(ag_k, s);

  if (factorBaseResult) {
    titleStep(
      7,
      `Выбираем случайное k: 0 ≤ k < ${n} => k = ${k} и вычисляем ag<sup>k</sup>.`
    );
    agKSection(k, ag_k, a, g, p);

    titleStep(8, `Попытка разложить по факторной базе ag<sup>k</sup>.`);

    result.push({ k: k, ag_k: ag_k, factorBase: factorBaseResult });
    decomposefactorBaseAGKSection(result);
  } else {
    return step8(s, n, a, g, p);
  }

  result.forEach((el) => {
    let text = "";
    text += `k: ${el.k} \t a*g^k: ${el.ag_k} \t`;
    const factors = Object.entries(el.factorBase)
      .map(([prime, power]) => `${prime}^${power}`)
      .join(" * ");
    text += factors;
  });

  return result;
}

function step9(resultStep8, s, logs, g, a, n, p) {
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

    logarithmicOfPartsFinalSection(s, row, k, log_a, logs, n, g, a, p);
  });

  return log_a;
}

function checkResult(x, g, p, a, n) {
  titleStep("", `Проверка результата x = ${x}.`);

  if (Array.isArray(x)) {
    x = x[0]?.value || x[x.length - 1]?.value;
  }
  const gPowX = sumMod(g, x, p);
  checkResultSection(`a = ${a}.`);
  if (gPowX === a) {
    checkResultSection(`${g}<sup>${x}</sup> mod ${p} = ${gPowX}`);
    checkResultSection(
      `Дискретный логарифм log<sub>${g}</sub>(${a}) ≡ ${x} (mod ${n})`
    );
  } else {
    checkResultSection(`${g}<sup>${x}</sup> (mod ${p}) = ${gPowX} ≠ ${a}.`);
    checkResultSection(`Не получилось :( <br/> Попробуй заново.`);
  }
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

function gKSection(k, g_k, g, p) {
  const gKDiv = document.createElement("div");
  gKDiv.className = "section-step";
  gKDiv.innerHTML = `g<sup>k</sup> = ${g}<sup>${k}</sup> mod ${p} = ${g_k}.`;
  result.appendChild(gKDiv);
}

function decomposefactorBaseGKSection(array) {
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

function logarithmicOfPartsSection(s, row, k, g, n, p) {
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

function findAllEquationSection(msg) {
  const findAllEquationDiv = document.createElement("div");
  findAllEquationDiv.className = "section-step find-all-equation";
  findAllEquationDiv.innerHTML = msg;
  result.appendChild(findAllEquationDiv);
}

function matrixVectorSection(s, matrix, vector, g) {
  const matrixVectorTable = document.createElement("table");
  const matrixVectorTbody = document.createElement("tbody");
  const matrixVectorThead = document.createElement("thead");
  matrixVectorTable.className = " matrix-vector";

  const trH = document.createElement("tr");
  s.forEach((el, index) => {
    const th = document.createElement("th");
    th.innerHTML = `log<sub>${g}</sub>(${el})`;
    trH.appendChild(th);
  });

  const thK = document.createElement("th");
  thK.innerHTML = `k`;
  trH.appendChild(thK);

  for (let i = 0; i < matrix.length; i++) {
    const tr = document.createElement("tr");
    for (let j = 0; j < matrix[i].length; j++) {
      const td = document.createElement("td");
      td.innerHTML = `${matrix[i][j]}`;
      tr.appendChild(td);
    }
    const td = document.createElement("td");
    td.innerHTML = `${vector[i]}`;
    tr.appendChild(td);
    matrixVectorTbody.appendChild(tr);
  }

  matrixVectorThead.appendChild(trH);
  matrixVectorTable.appendChild(matrixVectorThead);
  matrixVectorTable.appendChild(matrixVectorTbody);
  result.appendChild(matrixVectorTable);
}

function solveLinearSystemSection(msg) {
  const solveLinearSystemDiv = document.createElement("div");
  solveLinearSystemDiv.className = "section-step solve-linear-system";
  solveLinearSystemDiv.innerHTML = msg;
  result.appendChild(solveLinearSystemDiv);
}

function stepLinearSystemSection(msg) {
  const stepLinearSystemDiv = document.createElement("div");
  stepLinearSystemDiv.className = "section-step step-linear-system";
  stepLinearSystemDiv.innerHTML = msg;
  result.appendChild(stepLinearSystemDiv);
}

function agKSection(k, ag_k, a, g, p) {
  const agKDiv = document.createElement("div");
  agKDiv.className = "section-step";
  agKDiv.innerHTML = `ag<sup>k</sup> = ${a} * ${g}<sup>${k}</sup> mod ${p} = ${ag_k}.`;
  result.appendChild(agKDiv);
}

function decomposefactorBaseAGKSection(array) {
  const decomposefactorBaseDiv = document.createElement("div");
  decomposefactorBaseDiv.className = "section-step decompose-factor-base";
  const dict = array[0];

  decomposefactorBaseDiv.innerHTML = `ag<sup>k</sup> = ${dict.ag_k} = `;
  array.forEach((el) => {
    const factors = Object.entries(el.factorBase)
      .map(([prime, power]) => `${prime}<sup>${power > 1 ? power : ""}</sup>`)
      .join(" * ");
    decomposefactorBaseDiv.innerHTML += factors;
  });
  result.appendChild(decomposefactorBaseDiv);
}

function logarithmicOfPartsFinalSection(s, row, k, log_a, logs, n, g, a, p) {
  const logarithmicOfPartsDiv = document.createElement("div");
  logarithmicOfPartsDiv.className = "section-step logarithmic-of-parts";

  const outputPow = s
    .map((el_s, index) => {
      const coeff = row[index];

      return coeff ? `${el_s}${coeff > 1 ? `<sup>${coeff}</sup>` : ""}` : null;
    })
    .filter((x) => x)
    .join(" * ");

  const logsOutput =
    s
      .map((prime, index) => {
        const coeff = row[index];
        const logValue = logs[prime];

        if (coeff > 0 && logValue !== undefined) {
          if (coeff === 1) return `${logValue}`;
          return `${coeff} * ${logValue}`;
        }
        return null;
      })
      .filter((x) => x)
      .join(" + ") || "0";

  let logsOutputSum = 0;
  s.forEach((prime, index) => {
    const coeff = row[index];
    const logValue = logs[prime];

    if (coeff > 0 && logValue !== undefined) {
      logsOutputSum = (logsOutputSum + coeff * logValue) % n;
    }
  });

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

  logarithmicOfPartsDiv.innerHTML = `${a} * ${g}<sup>${k}</sup> ≡ ${outputPow} mod ${p} <br/> log<sub>${g}</sub>(${a}) + ${k} = ${equation}  mod ${n} <br/> log<sub>${g}</sub>(${a}) = ${equation} - ${k} mod ${n} <br/> log<sub>${g}</sub>(${a}) = ${logsOutput} - ${k} mod ${n} <br/> log<sub>${g}</sub>(${a}) = ${logsOutputSum} - ${k} mod ${n} <br/> log<sub>${g}</sub>(${a}) = ${
    logsOutputSum - k
  } mod ${n} <br/> log<sub>${g}</sub>(${a}) = ${log_a} <br/> x = ${log_a}`;

  result.appendChild(logarithmicOfPartsDiv);
}

function checkResultSection(msg) {
  const checkResultDiv = document.createElement("div");
  checkResultDiv.className = "section-step check-result";
  checkResultDiv.innerHTML = msg;
  result.appendChild(checkResultDiv);
}

function init(p, g, a, n, t, c) {
  const s = step1(t, p);
  factorBaseSection(s);

  let resultStep3 = step3(s, g, p, n);

  let { matrix, vector } = step4(resultStep3, s, n, t, c, g, p);

  ({ matrix, vector } = step5(s, resultStep3, t, c, n, g, p));

  const logs = step6(matrix, vector, s, t, n, g);

  if (logs === null || Object.keys(logs).length !== t) {
    result.innerHTML = `<h2>Решение:</h2>`;
    return init(p, g, a, n, t, c);
  }

  let resultStep8 = step8(s, n, a, g, p);

  const x = step9(resultStep8, s, logs, g, a, n, p);

  checkResult(x, g, p, a, n);
}
