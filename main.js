const p = 71;
const g = 7;
const a = 26;
const n = p - 1;
const B = 4;
const maxEquations = 5;

function step1(B) {
  const factorBase = [];

  function isPrime(num) {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) return false;
    }
    return true;
  }

  for (let i = 2; i <= B; i++) {
    if (isPrime(i)) {
      factorBase.push(i);
    }
  }

  return factorBase;
}

function modPow(a, x, n) {
  let result = 1;
  let base = a % n;
  let exp = x;

  while (exp > 0) {
    if (exp % 2 === 1) {
      result = (result * base) % n;
    }
    base = (base * base) % n;
    exp = Math.floor(exp / 2);
  }

  return result;
}

function modInverse(a, m) {
  let [old_r, r] = [a, m];
  let [old_s, s] = [1, 0];
  let [old_t, t] = [0, 1];

  while (r !== 0) {
    const quotient = Math.floor(old_r / r);
    [old_r, r] = [r, old_r - quotient * r];
    [old_s, s] = [s, old_s - quotient * s];
    [old_t, t] = [t, old_t - quotient * t];
  }

  return ((old_s % m) + m) % m;
}

function step2(number, factorBase) {
  const factorization = new Map();
  let temp = number;

  for (const prime of factorBase) {
    let count = 0;
    while (temp % prime === 0) {
      count++;
      temp = Math.floor(temp / prime);
    }
    if (count > 0) {
      factorization.set(prime, count);
    }
  }

  return temp === 1 ? factorization : null;
}

function step3(g, p, n, factorBase, maxEquations) {
  const relations = [];
  const seenK = new Set();

  console.log("Поиск линейных соотношений...");

  while (relations.length < maxEquations) {
    const k = Math.floor(Math.random() * (n - 2)) + 1;

    if (seenK.has(k)) continue;
    seenK.add(k);

    const gk = modPow(g, k, p);
    const factors = step2(gk, factorBase);

    if (factors !== null) {
      relations.push({
        k: k,
        gk: gk,
        factors: factors,
      });
      console.log(
        `Найдено соотношение ${relations.length}: ${g}^${k} = ${gk} (mod ${p})`
      );

      const factorsStr = Array.from(factors.entries())
        .map(([p, e]) => `${p}^${e}`)
        .join(" * ");
      console.log(`  Факторизация: ${gk} = ${factorsStr}`);
    }
  }

  return relations;
}

function step4(relations, factorBase, n) {
  const matrix = [];
  const vector = [];

  for (const relation of relations) {
    const row = [];

    for (const prime of factorBase) {
      const exponent = relation.factors.get(prime) || 0;
      row.push(exponent % n);
    }

    matrix.push(row);
    vector.push(relation.k % n);
  }

  return { matrix, vector };
}

function step5(matrix, vector, n) {
  console.log("Решение системы уравнений...");

  const augmentedMatrix = matrix.map((row, i) => [...row, vector[i]]);
  const rows = augmentedMatrix.length;
  const cols = matrix[0].length;

  console.log(`Размер матрицы: ${rows}x${cols}`);

  for (let col = 0; col < cols; col++) {
    let pivotRow = -1;
    for (let row = col; row < rows; row++) {
      if (augmentedMatrix[row][col] % n !== 0) {
        pivotRow = row;
        break;
      }
    }

    if (pivotRow === -1) continue;

    [augmentedMatrix[col], augmentedMatrix[pivotRow]] = [
      augmentedMatrix[pivotRow],
      augmentedMatrix[col],
    ];

    const pivot = augmentedMatrix[col][col];
    const invPivot = modInverse(pivot, n);

    for (let j = col; j <= cols; j++) {
      augmentedMatrix[col][j] = (augmentedMatrix[col][j] * invPivot) % n;
      if (augmentedMatrix[col][j] < 0) augmentedMatrix[col][j] += n;
    }

    for (let row = 0; row < rows; row++) {
      if (row !== col && augmentedMatrix[row][col] % n !== 0) {
        const factor = augmentedMatrix[row][col];
        for (let j = col; j <= cols; j++) {
          augmentedMatrix[row][j] =
            (augmentedMatrix[row][j] - factor * augmentedMatrix[col][j]) % n;
          if (augmentedMatrix[row][j] < 0) augmentedMatrix[row][j] += n;
        }
      }
    }
  }

  const solution = new Array(cols).fill(0);
  for (let i = 0; i < Math.min(rows, cols); i++) {
    if (augmentedMatrix[i][i] === 1) {
      solution[i] = augmentedMatrix[i][cols] % n;
    }
  }

  return solution;
}

function step6(solution, factorBase, g, p) {
  console.log("\nПроверка найденных логарифмов:");
  const logs = new Map();

  for (let i = 0; i < factorBase.length; i++) {
    const prime = factorBase[i];
    const log = solution[i];
    logs.set(prime, log);

    const left = modPow(g, log, p);
    const right = prime % p;
    console.log(
      `log_${g}(${prime}) = ${log}, проверка: ${g}^${log} mod ${p} = ${left}, ожидалось: ${right}`
    );
  }

  return logs;
}

function step7(a, g, p, n, factorBase, logs) {
  console.log("\nПоиск подходящего k для a*g^{-k}...");

  let attempts = 0;
  const maxAttempts = 10000;

  while (attempts < maxAttempts) {
    attempts++;
    const k = Math.floor(Math.random() * (n - 2)) + 1;

    const gInvK = modPow(modInverse(g, p), k, p);
    const value = (a * gInvK) % p;

    const factors = step2(value, factorBase);

    if (factors !== null) {
      console.log(`Найдено на попытке ${attempts}: k = ${k}`);
      console.log(
        `a * g^{-${k}} = ${a} * ${modInverse(g, p)}^${k} = ${value} (mod ${p})`
      );

      const factorsStr = Array.from(factors.entries())
        .map(([p, e]) => `${p}^${e}`)
        .join(" * ");
      console.log(`Факторизация: ${value} = ${factorsStr}`);

      return { k: k, value: value, factors: factors };
    }
  }

  throw new Error("Не удалось найти подходящий k");
}

function step8(logs, factors, k, n) {
  console.log("\nВычисление логарифма целевого элемента:");

  let logH = k % n;
  console.log(`Начальное значение: log(a) = k = ${k}`);

  for (const [prime, exponent] of factors.entries()) {
    const logPrime = logs.get(prime);
    if (logPrime === undefined) {
      throw new Error(`Не найден логарифм для простого числа ${prime}`);
    }

    const contribution = (logPrime * exponent) % n;
    logH = (logH + contribution) % n;
    console.log(
      `Добавляем log(${prime}) * ${exponent} = ${logPrime} * ${exponent} = ${contribution}`
    );
    console.log(`Текущее log(a) = ${logH}`);
  }

  return logH;
}

function step9(g, a, p, logH) {
  console.log("\nПроверка результата:");

  const left = modPow(g, logH, p);
  console.log(`Вычислено: ${g}^${logH} mod ${p} = ${left}`);
  console.log(`Ожидается: a = ${a}`);

  if (left === a % p) {
    console.log(`✓ УСПЕХ: log_${g}(${a}) mod ${p} = ${logH}`);
    return true;
  } else {
    console.log(`✗ ОШИБКА: Проверка не прошла`);
    return false;
  }
}

function main() {
  console.log("=== АЛГОРИТМ ИНДЕКСНОГО ИСЧИСЛЕНИЯ ===\n");
  console.log(`Параметры: p=${p}, g=${g}, a=${a}, n=p-1=${n}, B=${B}`);
  console.log(`Решаем: ${g}^x ≡ ${a} (mod ${p})`);

  console.log("\n--- Шаг 1: Генерация факторной базы ---");
  const factorBase = step1(B);
  console.log("Факторная база:", factorBase);

  console.log("\n--- Шаг 2-3: Сбор линейных соотношений ---");
  const relations = step3(g, p, n, factorBase, maxEquations);

  console.log("\n--- Шаг 4: Построение матрицы системы ---");
  const { matrix, vector } = step4(relations, factorBase, n);
  console.log("Матрица коэффициентов:");
  matrix.forEach((row, i) => {
    console.log(
      `  [${row.map((x) => x.toString().padStart(2)).join(", ")}] | ${
        vector[i]
      }`
    );
  });
  console.log("Вектор правых частей:", vector);

  console.log("\n--- Шаг 5: Решение системы уравнений ---");
  const solution = step5(matrix, vector, n);
  console.log("Решение системы:", solution);

  console.log("\n--- Шаг 6: Проверка логарифмов ---");
  const logs = step6(solution, factorBase, g, p);

  console.log("\n--- Шаг 7: Поиск подходящего k ---");
  const foundK = step7(a, g, p, n, factorBase, logs);

  console.log("\n--- Шаг 8: Вычисление log_g(a) ---");
  const logH = step8(logs, foundK.factors, foundK.k, n);

  console.log("\n--- Шаг 9: Проверка результата ---");
  const success = step9(g, a, p, logH);

  return { success, logH, factorBase, logs, relations };
}

try {
  console.log("=".repeat(60));
  const result = main();
  console.log("\n" + "=".repeat(60));
  console.log("ИТОГОВЫЙ РЕЗУЛЬТАТ:");
  console.log(`log_${g}(${a}) mod ${p} = ${result.logH}`);
  console.log(
    `Проверка: ${g}^${result.logH} mod ${p} = ${modPow(g, result.logH, p)}`
  );

  console.log("\nДополнительная проверка:");
  const directCheck = [];
  for (let x = 0; x < p; x++) {
    if (modPow(g, x, p) === a) {
      directCheck.push(x);
    }
  }
  if (directCheck.length > 0) {
    console.log(`Прямым перебором найдены решения: ${directCheck.join(", ")}`);
    if (directCheck.includes(result.logH)) {
      console.log("✓ Наше решение совпадает с одним из правильных!");
    }
  }
} catch (error) {
  console.error("Ошибка:", error.message);
}
