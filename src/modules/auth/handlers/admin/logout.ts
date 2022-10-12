/**
 * @oas [delete] /v1/store/auth
 * operationId: "DeleteAuth"
 * summary: "User Log out"
 * description: "Destroys a User's authenticated session."
 * x-authenticated: true
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request DELETE 'https://medusa-url.com/store/auth' \
 *       --header 'Cookie: connect.sid={sid}'
 * responses:
 *  "200":
 *    description: OK
 */
export default async (req, res) => {
  req.session.jwt = {}
  res.json({})
}