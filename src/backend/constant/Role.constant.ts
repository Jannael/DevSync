const Roles = {
  developer: 'developer',
  documenter: 'documenter',
  techLead: 'techLead',
} as const

export const ValidRoles = [Roles.developer, Roles.documenter, Roles.techLead]
export const DefaultRole = Roles.developer

export default Roles