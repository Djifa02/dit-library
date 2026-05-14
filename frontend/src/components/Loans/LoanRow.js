import React from 'react';

const statusColor = { ACTIVE: '#0f3460', RETURNED: '#4caf50', OVERDUE: '#f44336' };

const LoanRow = ({ loan, onReturn }) => {
  return (
    <div style={styles.row}>
      <span>{loan.first_name} {loan.last_name}</span>
      <span>{loan.title}</span>
      <span>{new Date(loan.loan_date).toLocaleDateString()}</span>
      <span>{new Date(loan.due_date).toLocaleDateString()}</span>
      <span style={{ color: statusColor[loan.status], fontWeight: 'bold' }}>{loan.status}</span>
      <span>
        {loan.status === 'ACTIVE' || loan.status === 'OVERDUE' ? (
          <button style={styles.btn} onClick={() => onReturn(loan.id)}>Retourner</button>
        ) : '-'}
      </span>
    </div>
  );
};

const styles = {
  row: { display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1fr 1fr 1fr 1fr', padding: '1rem', borderBottom: '1px solid #eee', alignItems: 'center' },
  btn: { backgroundColor: '#e94560', color: '#fff', border: 'none', padding: '0.3rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' },
};

export default LoanRow;