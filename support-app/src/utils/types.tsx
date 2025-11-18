// types.ts
export interface PartProps {
  _id: string;  
  type: string;
  model: string;
  quantity: number;
}

export interface EquipmentProps {
  _id: string; 
  name: string;
  type: string;
  operatingSystem?: string;
  available: boolean;
  parts?: PartProps[];  
}

export interface BuildingsAreasComponentProps {
  _id: string;
  name: string;
  tasks?: string[];
  equipments?: EquipmentProps[];
}

export interface TaskProps {
  _id: string;
  subject: string;
  message: string;
  serviceType?: string;
  priority?: string;
  status: string;
  assignedTo?: UserProps;
  createdBy: UserProps;
  assignedEquipment: EquipmentProps;
  creationDate: string;
  completedAt?: string;
  type?: string;
  changes?: ChangeProps[];
}

export interface UserProps {
  _id: string;
  profilePicture: string;
  name: string;
  email: string;
  role: string;
  ratings: [];
  averageRating: number;
  phone: string;
  speciality?: string;
}

export interface ChangeProps {
  _id : string;
  piece: PartProps;
  message: string;
  price: number;
  status: string;
  incident: TaskProps;
}

export interface ChangesProps {
  _id : string;
  piece: PartProps;
  message: string;
  price: number;
  status: string;
  incident?: TaskProps;
}

export interface ProblemProps {
  _id : string,
  equipment : EquipmentProps,
  assignedTo : UserProps,
  rootCause ?: string,
  knownError ?: string,
  solution ?: string,
  startDate : string,
  solutionDate ?: string,
  status : string,
}