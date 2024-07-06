function createMatrix() {
    const rows = parseInt(document.getElementById('rows').value);
    const cols = parseInt(document.getElementById('cols').value);
    const matrixContainer = document.getElementById('matrixContainer');
    matrixContainer.innerHTML = '';

    for (let i = 0; i < rows; i++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'matrix-row';
        for (let j = 0; j < cols; j++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.className = 'matrix-input';
            rowDiv.appendChild(input);
        }
        matrixContainer.appendChild(rowDiv);
    }

    document.getElementById('startElimination').disabled = false;
}

function getMatrix() {
    const rows = document.querySelectorAll('.matrix-row');
    const matrix = [];

    rows.forEach(row => {
        const inputs = row.querySelectorAll('.matrix-input');
        const rowArray = Array.from(inputs, input => parseFloat(input.value));
        matrix.push(rowArray);
    });

    return matrix;
}

function startElimination() {
    const matrix = getMatrix();
    const stepsContainer = document.getElementById('stepsContainer');
    stepsContainer.innerHTML = '';

    const steps = gaussianElimination(matrix);

    steps.forEach((step, index) => {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'step';
        stepDiv.innerHTML = `<strong>Step ${index + 1}:</strong><pre>${matrixToHtml(step)}</pre>`;
        stepsContainer.appendChild(stepDiv);
    });
}

function gaussianElimination(matrix) {
    const steps = [];
    const n = matrix.length;
    const m = matrix[0].length;

    for (let i = 0; i < n; i++) {
        // Pivoting: Find the row with the maximum element in the current column
        let maxRow = i;
        for (let k = i + 1; k < n; k++) {
            if (Math.abs(matrix[k][i]) > Math.abs(matrix[maxRow][i])) {
                maxRow = k;
            }
        }

        // Swap the maximum row with the current row
        [matrix[i], matrix[maxRow]] = [matrix[maxRow], matrix[i]];
        steps.push(matrix.map(row => row.slice()));

        // Make the diagonal contain all 1's
        const pivot = matrix[i][i];
        for (let j = i; j < m; j++) {
            matrix[i][j] /= pivot;
        }
        steps.push(matrix.map(row => row.slice()));

        // Make the elements below the pivot equal to 0
        for (let k = i + 1; k < n; k++) {
            const factor = matrix[k][i];
            for (let j = i; j < m; j++) {
                matrix[k][j] -= factor * matrix[i][j];
            }
            steps.push(matrix.map(row => row.slice()));
        }
    }

    // Back substitution
    for (let i = n - 1; i >= 0; i--) {
        for (let k = i - 1; k >= 0; k--) {
            const factor = matrix[k][i];
            for (let j = i; j < m; j++) {
                matrix[k][j] -= factor * matrix[i][j];
            }
            steps.push(matrix.map(row => row.slice()));
        }
    }

    for (let i = 0; i <rows; i++) {
        alert(matrix[i][i]);
    }

    return steps;

    
}

function matrixToHtml(matrix) {
    return matrix.map(row => row.map(num => num.toFixed(2)).join(' ')).join('\n');
}
