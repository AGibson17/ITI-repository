import '../styles/defaultStyles.css';
import '../components/Dashboard.css';

export default function Dashboard({ onNavigate }) {
  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="header">
        <img
          src="/images/CA/header-short.png"
          alt="CA DMV Header"
          className="header-img"
        />
      </div>

      {/* Red Banner */}
      <div className="redbar">
        ~ YOU ARE CURRENTLY LOGGED IN ~
      </div>

      {/* Main Content */}
      <div className="content">
        <table width="100%" cellSpacing="0" cellPadding="0" style={{ borderTop: '2px solid white' }}>
          <tbody>
            <tr align="center">
              <td>
                {/* Login fields - hidden since user is logged in */}
                <table className="CA-LoginBg" style={{ display: 'none' }}>
                  <tbody>
                    <tr>
                      <td>
                        <img src="/images/CA/login.png" className="LoginImg" alt="Login" />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <input
                          type="text"
                          title="Enter User ID"
                          className="LoginEntryFlds"
                          autoComplete="off"
                          style={{ display: 'none' }}
                        />
                        <br /><br />
                        <input
                          type="password"
                          title="Enter Password"
                          className="LoginEntryFlds"
                          autoComplete="off"
                          style={{ display: 'none' }}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <img className="loginBtn" src="/images/CA/submit.png" alt="Submit" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td>
                <img className="welcome" src="/images/CA/welcome.png" alt="Welcome" />
              </td>
            </tr>
            <tr>
              <td colSpan="2">
                <table width="100%">
                  <tbody>
                    <tr align="center" valign="middle" className="menu-icons-row">
                      <td>
                        <input
                          type="image"
                          className="homeSelections"
                          src="/images/CA/find-transactions.png"
                          alt="Find Transactions"
                          onClick={() => onNavigate && onNavigate('sst-search')}
                          style={{ cursor: 'pointer' }}
                        />
                      </td>
                      <td>
                        <input
                          type="image"
                          className="homeSelections"
                          src="/images/CA/view-reports.png"
                          alt="View Reports"
                          onClick={() => onNavigate && onNavigate('reports')}
                          style={{ cursor: 'pointer' }}
                        />
                      </td>
                      <td>
                        <input
                          type="image"
                          className="homeSelections"
                          src="/images/CA/admin.png"
                          alt="Administration"
                          onClick={() => onNavigate && onNavigate('admin')}
                          style={{ cursor: 'pointer' }}
                        />
                      </td>
                      <td>
                        <input
                          type="image"
                          className="homeSelections"
                          src="/images/CA/documents.png"
                          alt="Documents"
                          onClick={() => onNavigate && onNavigate('documents')}
                          style={{ cursor: 'pointer' }}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="footer"></div>
    </div>
  );
}
