import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: unknown; output: unknown; }
};

export type Address = {
  __typename?: 'Address';
  addressLine1: Scalars['String']['output'];
  city: Scalars['String']['output'];
  country: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  organization: Organization;
  organizationId: Scalars['ID']['output'];
  ownerId: Scalars['ID']['output'];
  ownerType: AddressOwnerType;
  state: Scalars['String']['output'];
};

export enum AddressOwnerType {
  Organization = 'ORGANIZATION',
  Patient = 'PATIENT',
  Staff = 'STAFF'
}

export type AuditLog = {
  __typename?: 'AuditLog';
  action: Scalars['String']['output'];
  actorDescription?: Maybe<Scalars['String']['output']>;
  actorId?: Maybe<Scalars['String']['output']>;
  actorType?: Maybe<Scalars['String']['output']>;
  appName: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  entity: Scalars['String']['output'];
  entityId?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  metadata?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type AuthResponse = {
  __typename?: 'AuthResponse';
  accessToken: Scalars['String']['output'];
  refreshToken?: Maybe<Scalars['String']['output']>;
};

/** Blood group of the patient */
export enum BloodGroup {
  AbNeg = 'AB_NEG',
  AbPos = 'AB_POS',
  ANeg = 'A_NEG',
  APos = 'A_POS',
  BNeg = 'B_NEG',
  BPos = 'B_POS',
  ONeg = 'O_NEG',
  OPos = 'O_POS'
}

export type CreateAddressInput = {
  addressLine1: Scalars['String']['input'];
  city: Scalars['String']['input'];
  country: Scalars['String']['input'];
  state: Scalars['String']['input'];
};

export type CreateOrganizationInput = {
  address?: InputMaybe<CreateAddressInput>;
  code?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<OrganizationStatus>;
  website?: InputMaybe<Scalars['String']['input']>;
};

export type CreatePatientInput = {
  addresses?: InputMaybe<Array<CreateAddressInput>>;
  allergies?: InputMaybe<Array<Scalars['String']['input']>>;
  bloodGroup?: InputMaybe<BloodGroup>;
  dateOfBirth: Scalars['String']['input'];
  email?: InputMaybe<Scalars['String']['input']>;
  fullName: Scalars['String']['input'];
  gender: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
};

export type CreateStaffInput = {
  email: Scalars['String']['input'];
  fullName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  roles: Array<StaffRole>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createOrganization: Organization;
  createPatient: Patient;
  createStaff: Staff;
  refreshToken: AuthResponse;
  staffLogin: AuthResponse;
  updateOrganizationStatus: Organization;
  updatePatientStatus: Patient;
};


export type MutationCreateOrganizationArgs = {
  data: CreateOrganizationInput;
};


export type MutationCreatePatientArgs = {
  data: CreatePatientInput;
};


export type MutationCreateStaffArgs = {
  data: CreateStaffInput;
};


export type MutationStaffLoginArgs = {
  input: StaffLoginInput;
};


export type MutationUpdateOrganizationStatusArgs = {
  id: Scalars['String']['input'];
  status: OrganizationStatus;
};


export type MutationUpdatePatientStatusArgs = {
  data: UpdatePatientStatusInput;
};

export type Organization = {
  __typename?: 'Organization';
  address?: Maybe<Address>;
  code?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  organizationNumber: Scalars['String']['output'];
  phoneNumber?: Maybe<Scalars['String']['output']>;
  status: OrganizationStatus;
  website?: Maybe<Scalars['String']['output']>;
};

/** Status of the organization */
export enum OrganizationStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE'
}

export type Patient = {
  __typename?: 'Patient';
  allergies?: Maybe<Array<Scalars['String']['output']>>;
  bloodGroup?: Maybe<BloodGroup>;
  dateOfBirth: Scalars['String']['output'];
  email?: Maybe<Scalars['String']['output']>;
  fullName: Scalars['String']['output'];
  gender: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  organization: Organization;
  organizationId: Scalars['ID']['output'];
  patientNumber: Scalars['String']['output'];
  phoneNumber?: Maybe<Scalars['String']['output']>;
  status: PatientStatus;
  userCode: Scalars['Float']['output'];
  userType: UserType;
};

/** Status of the patient */
export enum PatientStatus {
  Active = 'ACTIVE',
  Deceased = 'DECEASED',
  Discharged = 'DISCHARGED',
  Inactive = 'INACTIVE',
  Pending = 'PENDING',
  Suspended = 'SUSPENDED'
}

export type Query = {
  __typename?: 'Query';
  adminOnly: Scalars['String']['output'];
  getAuditLogs: Array<AuditLog>;
  health: Scalars['String']['output'];
  organization: Organization;
  organizations: Array<Organization>;
  patients: Array<Patient>;
  secretRoute: Scalars['String']['output'];
  staffByRole: Array<Staff>;
  staffs: Array<Staff>;
  whoAmI: WhoAmIDto;
};


export type QueryOrganizationArgs = {
  id: Scalars['String']['input'];
};


export type QueryStaffByRoleArgs = {
  role: StaffRole;
};

export type Staff = {
  __typename?: 'Staff';
  email: Scalars['String']['output'];
  fullName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  organization: Organization;
  organizationId: Scalars['ID']['output'];
  phoneNumber?: Maybe<Scalars['String']['output']>;
  roles: Array<StaffRole>;
  userCode: Scalars['Float']['output'];
  userType: UserType;
};

export type StaffLoginInput = {
  password: Scalars['String']['input'];
  userCode: Scalars['Float']['input'];
};

/** Roles assigned to staff members */
export enum StaffRole {
  Admin = 'ADMIN',
  Doctor = 'DOCTOR',
  LabTech = 'LAB_TECH',
  Nurse = 'NURSE',
  Pharmacist = 'PHARMACIST',
  Receptionist = 'RECEPTIONIST'
}

export type UpdatePatientStatusInput = {
  id: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
  status: PatientStatus;
};

/** Type of user */
export enum UserType {
  Admin = 'ADMIN',
  Patient = 'PATIENT',
  Staff = 'STAFF'
}

export type WhoAmIDto = {
  __typename?: 'WhoAmIDto';
  email: Scalars['String']['output'];
  roles: Array<Scalars['String']['output']>;
};

export type StaffLoginMutationVariables = Exact<{
  input: StaffLoginInput;
}>;


export type StaffLoginMutation = { __typename?: 'Mutation', staffLogin: { __typename?: 'AuthResponse', accessToken: string, refreshToken?: string | null } };

export type RefreshTokenMutationVariables = Exact<{ [key: string]: never; }>;


export type RefreshTokenMutation = { __typename?: 'Mutation', refreshToken: { __typename?: 'AuthResponse', accessToken: string, refreshToken?: string | null } };

export type WhoAmIQueryVariables = Exact<{ [key: string]: never; }>;


export type WhoAmIQuery = { __typename?: 'Query', whoAmI: { __typename?: 'WhoAmIDto', email: string, roles: Array<string> } };


export const StaffLoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"StaffLogin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StaffLoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"staffLogin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<StaffLoginMutation, StaffLoginMutationVariables>;
export const RefreshTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RefreshToken"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refreshToken"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<RefreshTokenMutation, RefreshTokenMutationVariables>;
export const WhoAmIDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"WhoAmI"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"whoAmI"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"roles"}}]}}]}}]} as unknown as DocumentNode<WhoAmIQuery, WhoAmIQueryVariables>;