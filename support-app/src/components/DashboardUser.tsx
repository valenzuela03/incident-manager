import React, {useEffect, useState} from 'react';

import MyIncidentsGenerated from './dashboardComponents/MyIncidentsGenerated';
import IncidentsOpen from './dashboardComponents/IncidentsOpen';
import HeaderComponent from './dashboardComponents/HeaderComponent';
import SideNavComponent from './dashboardComponents/SideNavComponent';
import BuildingsComponent from './dashboardComponents/BuildingsComponent';
import UserMagementComponent from './dashboardComponents/UserManagementComponent';
import IncidentManagerComponent from './dashboardComponents/IncidentManagerComponent';
import SupportIncidentsComponent from './dashboardComponents/SupportIncidentsComponent';
import IncidentHistoryComponent from './dashboardComponents/IncidentHistoryComponent';
import AdminChangesGestor from './dashboardComponents/AdminChangesGestor';
import MyProfile from './dashboardComponents/MyProfile';
import ProblemGestor from './dashboardComponents/ProblemGestor';
import MyProblemsAssigned from './dashboardComponents/MyProblemsAssigned';
const DashboardUser = ({user, setUser} : any) => {
  const [controller, setController] = useState('incidents');

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <HeaderComponent user={user} setUser={setUser} />
      <div className="flex flex-1 flex-col md:flex-row">
        <SideNavComponent setController={setController} user={user} />
        <main className="flex-1 p-4 md:p-8">
          {controller === 'profile' && <MyProfile user={user} />}
          {controller === 'incidents' && <IncidentsOpen user={user} />}
          {controller === 'myGeneratedIncidents' && <MyIncidentsGenerated />}
          {controller === 'buildings' && <BuildingsComponent />}
          {controller === 'userManagement' && <UserMagementComponent />}
          {controller === 'incidentManager' && <IncidentManagerComponent />}
          {controller === 'myIncidents' && < SupportIncidentsComponent/>}
          {controller === 'incidentHistory' && <IncidentHistoryComponent />}
          {controller === 'changesGestor' && <AdminChangesGestor />}
          {controller === 'problemGestor' && <ProblemGestor />}
          {controller === 'myProblemsAssigned' && <MyProblemsAssigned />}
        </main>
      </div>
    </div>
  );
}

export default DashboardUser;
