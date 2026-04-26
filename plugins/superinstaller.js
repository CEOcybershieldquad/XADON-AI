const fs = require('fs')
const path = require('path')
const axios = require('axios')
const { exec } = require('child_process')

const PLUGIN_DIR = __dirname

module.exports = {
  command: 'xsuper',
  description: 'Xadon Super Installer (plugins & npm)',
  category: 'system',

  execute: async (sock, m, { args, reply, isCreator }) => {

    const react = async (emoji) => {
      await sock.sendMessage(m.chat, {
        react: { text: emoji, key: m.key }
      })
    }

    if (!isCreator) {
      await react('🔒')
      return reply('SuperInstaller is owner-only')
    }

    const action = args[0]

    if (!action) {
      await react('ℹ️')
      return reply(
        '*Super Installer*\n\n' +
        '.super i <url>\n' +
        '.super i npm <package>\n' +
        '.super d <plugin>\n' +
        '.super pns'
      )
    }

    // ===== INSTALL =====
    if (action === 'i') {

      // npm install
      if (args[1] === 'npm') {
        const pkg = args[2]
        if (!pkg) {
          await react('❓')
          return reply('Usage: .super i npm <package>')
        }

        await react('⏳')
        reply(`📦 Installing npm: ${pkg}`)

        exec(`npm install ${pkg}`, async (err) => {
          if (err) {
            await react('❌')
            return reply('npm install failed')
          }
          await react('✅')
          reply(`npm package *${pkg}* installed\nRestart bot`)
        })
        return
      }

      // plugin install
      const url = args[1]
      if (!url) {
        await react('❓')
        return reply('Usage: .super i <plugin_url>')
      }

      try {
        await react('⏳')
        const name = url.split('/').pop().replace('.js', '')
        const filePath = path.join(PLUGIN_DIR, `${name}.js`)
        const res = await axios.get(url, { timeout: 15000 })

        fs.writeFileSync(filePath, res.data)

        await react('✅')
        reply(`Plugin *${name}.js* installed\nRestart bot`)
      } catch {
        await react('❌')
        reply('Failed to install plugin')
      }
    }

    // ===== DELETE =====
    if (action === 'd') {
      const name = args[1]
      if (!name) {
        await react('❓')
        return reply('Usage: .super d <plugin>')
      }

      const filePath = path.join(PLUGIN_DIR, `${name}.js`)
      if (!fs.existsSync(filePath)) {
        await react('⚠️')
        return reply('Plugin not found')
      }

      await react('🗑️')
      fs.unlinkSync(filePath)
      await react('✅')
      reply(`Plugin *${name}* removed\nRestart bot`)
    }

    // ===== LIST =====
    if (action === 'pns') {
      await react('📦')

      const files = fs.readdirSync(PLUGIN_DIR).filter(f => f.endsWith('.js'))
      let msg = '📦 *Installed Plugins*\n\n'

      for (const file of files) {
        try {
          const plugin = require(`./${file}`)
          msg += `• ${file.replace('.js','')} — ${plugin.description || 'No description'}\n`
        } catch {
          msg += `• ${file.replace('.js','')} — error\n`
        }
      }

      reply(msg)
    }
  }
}
