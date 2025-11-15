variable "api_token" { type = string }
variable "zone_id" { type = string }
variable "domain" { type = string }
variable "lb_origins" { type = list(string) }
variable "access_email_domain" { type = string }
variable "logpush_destination" { type = string }