const host = require("../config/host");
module.exports = (nickname, token) => {
  const html = `
  <table width="100%" border="0" cellspacing="0" style="width: 100% !important">
    <tbody>
      <tr>
        <td align="center">
          <table
            width="600"
            border="0"
            cellspacing="0"
            cellpadding="40"
            style="border: 1px solid #eaeaea; border-radius: 5px; margin: 40px 0"
          >
            <tbody>
              <tr>
                <td align="center">
                  <div
                    style="
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                        Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
                        'Helvetica Neue', sans-serif;
                      text-align: left;
                      width: 465px;
                    "
                  >
                    <table
                      width="100%"
                      border="0"
                      cellspacing="0"
                      cellpadding="0"
                      style="width: 100% !important"
                    >
                      <tbody>
                        <tr>
                          <td align="center">
                            <div>
                              <img
                                src="https://user-images.githubusercontent.com/51100935/92151188-aa035080-ee5b-11ea-8650-6ecb62f91443.png"
                                width="200px"
                              />
                              <h1
                                style="
                                  color: #000;
                                  font-family: -apple-system, BlinkMacSystemFont,
                                    'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
                                    'Open Sans', 'Helvetica Neue', sans-serif;
                                  font-size: 24px;
                                  font-weight: normal;
                                  margin: 30px 0;
                                  margin-top: 15px;
                                  padding: 0;
                                "
                              >
                                <b>자취인</b>
                                <span>이메일 인증</span>
                              </h1>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <p
                      style="
                        color: #000;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                          Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
                          'Helvetica Neue', sans-serif;
                        font-size: 14px;
                        line-height: 24px;
                      "
                    >
                      안녕하세요 <b>${nickname}</b>님!
                    </p>
                    <p
                      style="
                        color: #000;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                          Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
                          'Helvetica Neue', sans-serif;
                        font-size: 14px;
                        line-height: 24px;
                      "
                    >
                      자취인의 회원이 되신 것을 진심으로 환영합니다!
                    </p>
                    <p
                      style="
                        color: #000;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                          Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
                          'Helvetica Neue', sans-serif;
                        font-size: 14px;
                        line-height: 24px;
                      "
                    >
                      아래의 링크를 클릭하면 회원가입이 완료됩니다.
                    </p>
                    <p
                      style="
                        color: #000;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                          Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
                          'Helvetica Neue', sans-serif;
                        font-size: 14px;
                        line-height: 24px;
                      "
                    >
                      <a href="${host.serverHost()}/users/confirm?token=${token}"
                      style="color: #067df7; text-decoration: none"
                      target="_blank">인증하기</a>
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>`;
  return html;
};
