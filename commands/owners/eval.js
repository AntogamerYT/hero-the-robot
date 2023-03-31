import { inspect } from "util"

export const name = "eval"
export const allowDMs = true
export const aliases = ["ev"]
export const cooldown = 0
export async function execute(client, message, args) {
    if (!client.owners.includes(message.author.id))
        return

    function clean(text) {
        if (typeof (text) === "string")
            return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203)) /*.replace("```js", "")*/.replaceAll("`", "`").trim()

        else
            return text
    }
    let toEval = clean(args.join(" "))

    try {
        if (toEval) {
            toEval = `(async () => {${toEval}});`
            const evaluated = eval(toEval, { depth: 0 })
            let result = inspect(await evaluated())
            let description = `\`\`\`js\n${result}\`\`\``
            if (result === "undefined") {
                description += "Did you forget to use `return`?"
            }
            if (result.length > 4096) {
                return await message.channel.send({
                    content: `Output was too long, sent the result as a file.`,
                    files: [{ attachment: Buffer.from(result), name: 'output.js' }]
                })
            }
            const e = {
                color: 3066993,
                title: "Evaluation Executed!",
                description: description,
                timestamp: new Date()
            }
            await message.channel.send({ embeds: [e] })

        }
    } catch (error) {
        const embed = {
            color: 15158332,
            title: "Evaluation Cancelled",
            description: `\`\`\`${error}\`\`\``,
            timestamp: new Date()
        }
        await message.channel.send({ embeds: [embed] })
    }
}